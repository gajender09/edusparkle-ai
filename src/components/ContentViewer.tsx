import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Lightbulb,
  Code,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProgressTracker } from '@/hooks/use-progress-tracker';

interface ContentViewerProps {
  courseId: string;
  moduleIndex: number;
  chapterIndex: number;
  chapterTitle: string;
  totalChapters: number;
  onNavigate: (moduleIndex: number, chapterIndex: number) => void;
  onComplete: () => void;
}

const ContentViewer = ({ 
  courseId, 
  moduleIndex, 
  chapterIndex, 
  chapterTitle, 
  totalChapters,
  onNavigate,
  onComplete 
}: ContentViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [startTime] = useState(Date.now());
  
  const { 
    markChapterComplete, 
    isChapterCompleted, 
    getChapterProgress 
  } = useProgressTracker();

  const isCompleted = isChapterCompleted(courseId, moduleIndex, chapterIndex);
  const chapterProgress = getChapterProgress(courseId, moduleIndex, chapterIndex);

  useEffect(() => {
    generateContent();
  }, [chapterTitle, moduleIndex, chapterIndex]);

  const generateContent = async () => {
    if (!chapterTitle) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          topic: chapterTitle,
          context: `This is chapter ${chapterIndex + 1} of module ${moduleIndex + 1}. Focus on practical learning with examples and clear explanations.`
        }
      });

      if (error) throw error;

      if (data?.content) {
        setContent(data.content);
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content: ' + error.message);
      
      // Fallback content
      setContent(`# ${chapterTitle}

This chapter will cover the fundamentals of ${chapterTitle.toLowerCase()}.

## Overview

Welcome to this comprehensive guide on ${chapterTitle}. In this chapter, you'll learn:

- Core concepts and principles
- Practical applications
- Real-world examples
- Best practices

## Getting Started

Let's begin by understanding the basic concepts...

## Key Concepts

### Concept 1: Foundation
Understanding the foundational elements is crucial for mastering ${chapterTitle}.

### Concept 2: Implementation
Here's how you can implement these concepts in practice:

\`\`\`javascript
// Example code snippet
function example() {
  console.log("Learning ${chapterTitle}");
}
\`\`\`

## Practical Examples

Here are some practical examples to help you understand better...

## Summary

In this chapter, we covered the essential aspects of ${chapterTitle}. Continue to the next chapter to build upon these concepts.`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
    await markChapterComplete(courseId, moduleIndex, chapterIndex, timeSpent);
    onComplete();
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    let newChapterIndex = chapterIndex;
    let newModuleIndex = moduleIndex;

    if (direction === 'next') {
      if (chapterIndex < 5) { // 6 chapters per module (0-5)
        newChapterIndex = chapterIndex + 1;
      } else {
        newModuleIndex = moduleIndex + 1;
        newChapterIndex = 0;
      }
    } else {
      if (chapterIndex > 0) {
        newChapterIndex = chapterIndex - 1;
      } else if (moduleIndex > 0) {
        newModuleIndex = moduleIndex - 1;
        newChapterIndex = 5; // Last chapter of previous module
      }
    }

    onNavigate(newModuleIndex, newChapterIndex);
  };

  const canGoPrev = moduleIndex > 0 || chapterIndex > 0;
  const canGoNext = moduleIndex < 5 || chapterIndex < 5; // Assuming 6 modules max

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary p-2">
                  <BookOpen className="w-full h-full text-white" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">
                    Module {moduleIndex + 1} • Chapter {chapterIndex + 1}
                  </Badge>
                  <h1 className="text-2xl font-bold text-gradient">{chapterTitle}</h1>
                </div>
              </div>
              
              <div className="text-right">
                {isCompleted && (
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
                {chapterProgress.timeSpent > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{chapterProgress.timeSpent}m</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => handleNavigation('prev')}
                disabled={!canGoPrev}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-4">
                {!isCompleted && (
                  <Button
                    onClick={handleMarkComplete}
                    className="gradient-primary text-white flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete
                  </Button>
                )}

                <Button
                  onClick={() => handleNavigation('next')}
                  disabled={!canGoNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="glass-card border-0 shadow-xl">
          <CardContent className="p-8">
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    code: ({ node, inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl !mt-6 !mb-6"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-muted px-2 py-1 rounded-md text-sm" {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-bold mb-6 text-gradient">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mt-6 mb-3 text-primary">{children}</h3>
                    ),
                    blockquote: ({ children }) => (
                      <div className="glass p-4 rounded-xl border-l-4 border-primary my-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <div className="text-sm">{children}</div>
                        </div>
                      </div>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2 mb-6">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>{children}</div>
                      </li>
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => handleNavigation('prev')}
            disabled={!canGoPrev}
            className="flex items-center gap-2 px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Chapter
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Chapter {chapterIndex + 1} of {totalChapters}
            </p>
          </div>

          <Button
            onClick={() => handleNavigation('next')}
            disabled={!canGoNext}
            className="gradient-primary text-white flex items-center gap-2 px-6 py-3"
          >
            Next Chapter
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;