const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    
    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a learning resources curator. Today is ${today}. Generate a JSON response with curated learning resources for the category: "${category || 'all'}".

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "freeCourses": [
    {
      "title": "Course name",
      "provider": "Platform name (e.g. Coursera, freeCodeCamp, MIT OCW, Khan Academy, edX)",
      "url": "https://actual-url-to-course",
      "description": "Brief description",
      "topics": ["topic1", "topic2"],
      "duration": "Estimated duration",
      "level": "Beginner/Intermediate/Advanced"
    }
  ],
  "paidCourses": [
    {
      "title": "Course name",
      "provider": "Platform name (e.g. Udemy, Coursera, Pluralsight)",
      "url": "https://actual-url-to-course",
      "description": "Brief description",
      "topics": ["topic1", "topic2"],
      "duration": "Estimated duration",
      "level": "Beginner/Intermediate/Advanced",
      "price": "Approximate price or subscription info"
    }
  ],
  "studyMaterials": [
    {
      "title": "Resource name",
      "type": "PDF/Notes/Cheatsheet/Documentation",
      "url": "https://actual-url",
      "description": "Brief description",
      "topics": ["topic1", "topic2"]
    }
  ]
}

Include 6-8 items per category. Use real, well-known courses and resources that actually exist. Focus on:
- Programming (Python, JavaScript, Java, C/C++)
- Computer Science fundamentals
- Data Science & AI/ML
- Web Development
- Cloud certifications (AWS, Azure, GCP)
- Cybersecurity
- Mathematics for CS
- General academic subjects

Make sure all URLs are real and point to actual courses/resources on major platforms.`;

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-proxy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI proxy error:', errorText);
      throw new Error(`AI proxy error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';
    
    // Parse the JSON from the AI response
    let resources;
    try {
      // Try to extract JSON from the response (handle potential markdown wrapping)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resources = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse learning resources');
    }

    return new Response(JSON.stringify({ success: true, data: resources, date: today }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
