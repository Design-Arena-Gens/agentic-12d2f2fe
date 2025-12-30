'use client'

import { useState } from 'react'
import { Play, Download, FileText, Video, Sparkles, Clock, TrendingUp, MessageSquare } from 'lucide-react'

interface VideoData {
  videoId: string
  title: string
  duration: string
  viewCount: string
  likeCount: string
  commentCount: string
  publishDate: string
  description: string
  tags: string[]
  thumbnailUrl: string
}

interface AgentTask {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  result?: any
  error?: string
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [tasks, setTasks] = useState<AgentTask[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  const availableActions = [
    { id: 'extract-info', name: 'Extract Video Information', icon: FileText },
    { id: 'generate-summary', name: 'Generate Summary', icon: Sparkles },
    { id: 'analyze-engagement', name: 'Analyze Engagement', icon: TrendingUp },
    { id: 'extract-timestamps', name: 'Extract Timestamps', icon: Clock },
    { id: 'analyze-comments', name: 'Analyze Comments', icon: MessageSquare },
    { id: 'generate-script', name: 'Generate Video Script', icon: Video },
  ]

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    )
  }

  const simulateVideoFetch = async (videoId: string): Promise<VideoData> => {
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
      videoId,
      title: 'How to Build AI Agents - Complete Tutorial',
      duration: '45:32',
      viewCount: '1,234,567',
      likeCount: '45,678',
      commentCount: '3,456',
      publishDate: '2024-01-15',
      description: 'Learn how to build powerful AI agents from scratch. This comprehensive tutorial covers everything from basic concepts to advanced automation techniques.',
      tags: ['AI', 'Machine Learning', 'Tutorial', 'Automation', 'Programming'],
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    }
  }

  const executeTask = async (taskId: string, taskName: string, videoData: VideoData) => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const results: Record<string, any> = {
      'extract-info': {
        title: videoData.title,
        channel: 'AI Academy',
        duration: videoData.duration,
        views: videoData.viewCount,
        uploadDate: videoData.publishDate,
        tags: videoData.tags,
      },
      'generate-summary': {
        summary: 'This video provides a comprehensive guide to building AI agents. Key topics include: agent architecture, decision-making systems, tool integration, and real-world deployment strategies. Perfect for developers looking to implement intelligent automation.',
        keyPoints: [
          'Understanding agent architecture and design patterns',
          'Implementing decision-making algorithms',
          'Integrating external tools and APIs',
          'Deployment and scaling strategies',
          'Best practices for production systems'
        ]
      },
      'analyze-engagement': {
        engagementRate: '3.8%',
        likeToViewRatio: '3.7%',
        commentToViewRatio: '0.28%',
        trend: 'Above Average',
        insights: [
          'High engagement compared to channel average',
          'Strong positive sentiment in like ratio',
          'Active discussion in comments section',
          'Content resonates well with target audience'
        ]
      },
      'extract-timestamps': {
        chapters: [
          { time: '0:00', title: 'Introduction to AI Agents' },
          { time: '5:23', title: 'Core Concepts and Architecture' },
          { time: '12:45', title: 'Building Your First Agent' },
          { time: '23:10', title: 'Advanced Features' },
          { time: '35:20', title: 'Deployment Strategies' },
          { time: '42:15', title: 'Conclusion and Next Steps' }
        ]
      },
      'analyze-comments': {
        sentiment: 'Positive (87%)',
        topComments: [
          { text: 'Best tutorial on AI agents I\'ve found!', likes: 234 },
          { text: 'The examples are really helpful', likes: 156 },
          { text: 'Can you make a follow-up on advanced topics?', likes: 98 }
        ],
        commonQuestions: [
          'How to handle errors in production?',
          'Best practices for agent memory?',
          'Integration with existing systems?'
        ]
      },
      'generate-script': {
        script: `[INTRO - 0:00-1:00]
"Hey everyone! Today we're diving deep into AI agents - what they are, how they work, and how you can build your own..."

[MAIN CONTENT - 1:00-40:00]
"Let's start with the fundamentals. An AI agent is a system that can perceive its environment, make decisions, and take actions to achieve specific goals..."

[SECTIONS]
- Architecture Overview
- Implementation Guide
- Tool Integration
- Real-world Examples

[CONCLUSION - 40:00-45:32]
"That's everything you need to know to get started building AI agents. Remember to start simple and iterate..."`,
        hooks: [
          'Opening question to grab attention',
          'Promise of actionable takeaways',
          'Tease advanced content at the end'
        ]
      }
    }

    return results[taskId] || { message: 'Task completed successfully' }
  }

  const processVideo = async () => {
    const videoId = extractVideoId(videoUrl)

    if (!videoId) {
      alert('Invalid YouTube URL')
      return
    }

    if (selectedActions.length === 0) {
      alert('Please select at least one action')
      return
    }

    setIsProcessing(true)
    setVideoData(null)
    setTasks([])

    try {
      const data = await simulateVideoFetch(videoId)
      setVideoData(data)

      const newTasks: AgentTask[] = selectedActions.map(actionId => ({
        id: actionId,
        name: availableActions.find(a => a.id === actionId)?.name || actionId,
        status: 'pending' as const,
      }))

      setTasks(newTasks)

      for (let i = 0; i < newTasks.length; i++) {
        const task = newTasks[i]

        setTasks(prev => prev.map(t =>
          t.id === task.id ? { ...t, status: 'running' as const } : t
        ))

        try {
          const result = await executeTask(task.id, task.name, data)

          setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, status: 'completed' as const, result } : t
          ))
        } catch (error) {
          setTasks(prev => prev.map(t =>
            t.id === task.id ? {
              ...t,
              status: 'error' as const,
              error: 'Task failed'
            } : t
          ))
        }
      }
    } catch (error) {
      alert('Failed to process video')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderTaskResult = (task: AgentTask) => {
    if (!task.result) return null

    return (
      <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm">
        <pre className="whitespace-pre-wrap text-gray-700">
          {JSON.stringify(task.result, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Play className="text-red-600" size={48} />
            YouTube Automation Agent
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered video analysis and content generation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <button
                onClick={processVideo}
                disabled={isProcessing || !videoUrl}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Process'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Actions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableActions.map((action) => {
                const Icon = action.icon
                const isSelected = selectedActions.includes(action.id)

                return (
                  <button
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon className="mx-auto mb-2" size={24} />
                    <div className="text-sm font-medium">{action.name}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {videoData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={videoData.thumbnailUrl}
                  alt={videoData.title}
                  className="w-full rounded-lg shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="480" height="360"%3E%3Crect fill="%23ddd" width="480" height="360"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EThumbnail%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">{videoData.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Duration:</span>
                    <span className="ml-2 text-gray-900">{videoData.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Views:</span>
                    <span className="ml-2 text-gray-900">{videoData.viewCount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Likes:</span>
                    <span className="ml-2 text-gray-900">{videoData.likeCount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Comments:</span>
                    <span className="ml-2 text-gray-900">{videoData.commentCount}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {videoData.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Tasks</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'running' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>

                  {task.status === 'running' && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}

                  {task.status === 'completed' && renderTaskResult(task)}

                  {task.status === 'error' && (
                    <div className="mt-2 text-red-600 text-sm">
                      {task.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && !isProcessing && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Video className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Tasks Running
            </h3>
            <p className="text-gray-500">
              Enter a YouTube URL and select actions to start automating
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
