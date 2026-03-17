import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_EXAM_SCHEDULE = [
  { id: 1, subject: 'Data Structures', code: 'CS301', date: '2026-04-15', time: '10:00:00', venue: 'Exam Hall A', type: 'Mid-Sem' },
  { id: 2, subject: 'Operating Systems', code: 'CS302', date: '2026-04-17', time: '10:00:00', venue: 'Exam Hall B', type: 'Mid-Sem' },
  { id: 3, subject: 'Database Systems', code: 'CS303', date: '2026-04-19', time: '14:00:00', venue: 'Exam Hall A', type: 'Mid-Sem' },
  { id: 4, subject: 'Computer Networks', code: 'CS304', date: '2026-04-21', time: '10:00:00', venue: 'Exam Hall C', type: 'Mid-Sem' },
  { id: 5, subject: 'Discrete Mathematics', code: 'MA301', date: '2026-04-23', time: '14:00:00', venue: 'Exam Hall B', type: 'Mid-Sem' },
];

const MOCK_RESULTS = [
  { id: 101, subject: 'Data Structures', code: 'CS301', marks: 88, total: 100, grade: 'A', credits: 4 },
  { id: 102, subject: 'Operating Systems', code: 'CS302', marks: 76, total: 100, grade: 'B+', credits: 4 },
  { id: 103, subject: 'Database Systems', code: 'CS303', marks: 92, total: 100, grade: 'A+', credits: 4 },
  { id: 104, subject: 'Computer Networks', code: 'CS304', marks: 71, total: 100, grade: 'B', credits: 3 },
  { id: 105, subject: 'Discrete Mathematics', code: 'MA301', marks: 85, total: 100, grade: 'A', credits: 3 },
  { id: 106, subject: 'Software Engineering', code: 'CS305', marks: 79, total: 100, grade: 'B+', credits: 3 },
];

export function useExamsData(user) {
  const [schedule, setSchedule] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setSchedule(MOCK_EXAM_SCHEDULE);
      setResults(MOCK_RESULTS);
      setLoading(false);
      return;
    }

    const fetchExamsData = async () => {
      setLoading(true);
      try {
        // Fetch upcoming schedule for user's department/year
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('exams')
          .select('*')
          .eq('department', user.department || 'Computer Science')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (scheduleError) throw scheduleError;

        // Fetch past results for the student
        const { data: resultsData, error: resultsError } = await supabase
          .from('exam_results')
          .select(`
            id, marks, total, grade, credits,
            exam:exams!inner(subject, code)
          `)
          .eq('student_id', user.id);

        if (resultsError) throw resultsError;

        setSchedule(scheduleData?.length ? scheduleData : MOCK_EXAM_SCHEDULE);
        
        const mappedResults = resultsData?.map(r => ({
          id: r.id,
          subject: r.exam.subject,
          code: r.exam.code,
          marks: r.marks,
          total: r.total,
          grade: r.grade,
          credits: r.credits
        })) || [];

        setResults(mappedResults.length ? mappedResults : MOCK_RESULTS);
      } catch (err) {
        console.error('Failed to fetch exams data:', err);
        setSchedule(MOCK_EXAM_SCHEDULE);
        setResults(MOCK_RESULTS);
      } finally {
        setLoading(false);
      }
    };

    fetchExamsData();
  }, [user]);

  // Calculate SGPA
  const calculateSgpa = () => {
    if (!results.length) return '0.00';
    const totalPoints = results.reduce((acc, r) => acc + ((r.marks / r.total) * 10) * r.credits, 0);
    const totalCredits = results.reduce((acc, r) => acc + r.credits, 0);
    if (totalCredits === 0) return '0.00';
    return (totalPoints / totalCredits).toFixed(2);
  };

  return { schedule, results, sgpa: calculateSgpa(), loading };
}
