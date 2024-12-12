// app/blog/page.tsx
"use client";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export default function BlogPage() {
  // Example blog posts - in a real app, these would come from an API or database
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Understanding Anxiety Disorders: Causes and Treatment",
      excerpt: "Learn about the different types of anxiety disorders, their symptoms, and modern treatment approaches...",
      date: "2024-01-15",
      category: "Mental Health"
    },
    {
      id: 2,
      title: "The Role of Exercise in Managing Depression",
      excerpt: "Discover how physical activity can help alleviate symptoms of depression and improve mental wellbeing...",
      date: "2024-01-12",
      category: "Depression"
    },
    {
      id: 3,
      title: "Latest Advances in Mental Health Medication",
      excerpt: "Exploring recent developments in psychiatric medications and their effectiveness...",
      date: "2024-01-10",
      category: "Medical Research"
    }
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar - keeping consistent with main layout */}
      <div className="w-64 bg-slate-800 p-5 text-white">
        <h2 className="mb-2 text-center text-2xl font-bold text-blue-400">Symptraige</h2>
        <p className="mb-5 text-center text-sm text-gray-400">Mental Health Support</p>
        <ul>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">All Articles</li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">Mental Health</li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">Depression</li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">Medical Research</li>
        </ul>
      </div>

      {/* Blog Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="bg-blue-500 p-5 text-white">
          <h1 className="text-2xl font-bold text-center">Medical Articles</h1>
        </div>
        
        <div className="p-6 max-w-4xl mx-auto">
          {blogPosts.map((post) => (
            <article key={post.id} className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <div className="mb-2">
                <span className="text-sm text-blue-500 font-semibold">{post.category}</span>
                <span className="text-sm text-gray-500 ml-4">{post.date}</span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
              <p className="text-gray-600">{post.excerpt}</p>
              <button className="mt-4 text-blue-500 hover:text-blue-700 font-semibold">
                Read More →
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}