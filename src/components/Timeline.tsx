import React from 'react';
import { useThesisStore } from '../store/thesisStore';
import { format, isValid, parseISO, differenceInDays } from 'date-fns';
import { Clock, CheckCircle, AlertCircle, Calendar, Target } from 'lucide-react';

export function Timeline() {
  const { chapters, metadata } = useThesisStore();

  const events = React.useMemo(() => {
    return chapters
      .flatMap(chapter => 
        chapter.sections
          .filter(section => {
            try {
              return section.lastModified && isValid(parseISO(section.lastModified));
            } catch {
              return false;
            }
          })
          .map(section => ({
            date: parseISO(section.lastModified),
            title: `Updated "${section.title}"`,
            status: section.status,
            chapterTitle: chapter.title,
            wordCount: section.content.trim().split(/\s+/).length
          }))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [chapters]);

  const targetDate = metadata.targetDate ? parseISO(metadata.targetDate) : null;
  const daysRemaining = targetDate ? differenceInDays(targetDate, new Date()) : null;
  const totalWords = chapters.reduce((acc, chapter) => 
    acc + chapter.sections.reduce((secAcc, section) => 
      secAcc + section.content.trim().split(/\s+/).length, 0
    ), 0
  );
  const progressPercentage = metadata.wordCountGoal 
    ? Math.min(100, (totalWords / metadata.wordCountGoal) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Timeline & Progress
        </h2>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-semibold">{totalWords} / {metadata.wordCountGoal}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Words Written</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="text-lg font-semibold">
              {daysRemaining !== null ? `${daysRemaining} days` : 'No deadline'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Until Target Date</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          events.slice(0, 10).map((event, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {event.status === 'final' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : event.status === 'review' ? (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {format(event.date, 'MMM d, yyyy HH:mm')}
                </p>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">
                  in {event.chapterTitle} ({event.wordCount} words)
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}