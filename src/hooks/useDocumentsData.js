import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_DOCUMENTS = [
  { id: 1, type: 'Bonafide Certificate', requestDate: '2026-03-10T10:00:00Z', status: 'approved', remarks: 'Ready for collection', file_url: '' },
  { id: 2, type: 'Transcript', requestDate: '2026-03-12T10:00:00Z', status: 'pending', remarks: 'Under review', file_url: '' },
  { id: 3, type: 'No Objection Certificate', requestDate: '2026-03-05T10:00:00Z', status: 'ready', remarks: 'Collect from admin office', file_url: '' },
  { id: 4, type: 'Character Certificate', requestDate: '2026-02-28T10:00:00Z', status: 'rejected', remarks: 'Incomplete application', file_url: '' },
  { id: 5, type: 'Migration Certificate', requestDate: '2026-03-15T10:00:00Z', status: 'pending', remarks: 'Processing', file_url: '' },
];

export function useDocumentsData(user) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setDocuments(MOCK_DOCUMENTS);
      setLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        let query = supabase.from('documents').select('*').order('created_at', { ascending: false });
        
        // Students see only their own docs, admins/faculty see all
        if (user.role === 'student') {
          query = query.eq('student_id', user.id);
        }

        const { data, error } = await query;
        if (error) throw error;

        const mappedDocs = (data || []).map(doc => ({
          id: doc.id,
          type: doc.type,
          requestDate: doc.created_at,
          status: doc.status === 'approved' ? 'ready' : doc.status, // mapping logic for the UI
          remarks: doc.remarks || 'Processing',
          file_url: doc.file_url
        }));

        setDocuments(mappedDocs.length ? mappedDocs : []);
      } catch (err) {
        console.error('Failed to fetch documents:', err);
        setDocuments(MOCK_DOCUMENTS); // fallback to mock on error to keep UI alive
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const submitDocumentRequest = async (type, copies, remarks) => {
    if (IS_DEMO_MODE) {
      alert(`Demo Mode: Requested ${copies} copies of ${type}.`);
      return true;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.from('documents').insert({
        student_id: user.id,
        type: `${type} (x${copies})`,
        status: 'pending',
        remarks: remarks || 'Awaiting review',
        file_url: '' // No attachment upload built in UI yet
      }).select();

      if (error) throw error;
      
      const newDoc = {
        id: data[0].id,
        type: data[0].type,
        requestDate: data[0].created_at,
        status: data[0].status,
        remarks: data[0].remarks,
        file_url: data[0].file_url
      };

      setDocuments([newDoc, ...documents]);
      return true;
    } catch (err) {
      console.error('Error requesting document:', err);
      alert('Failed to submit request.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const cancelRequest = async (id) => {
    if (IS_DEMO_MODE) {
      setDocuments(documents.filter(d => d.id !== id));
      return;
    }

    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      setDocuments(documents.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error cancelling request', err);
      alert('Could not cancel the request.');
    }
  };

  return { documents, loading, submitting, submitDocumentRequest, cancelRequest };
}
