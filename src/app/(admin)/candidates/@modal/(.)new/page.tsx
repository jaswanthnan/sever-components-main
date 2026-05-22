import React from 'react';
import Modal from '@/components/ui/Modal';
import CandidateForm from '@/components/candidates/CandidateForm';

export default function InterceptedNewCandidatePage() {
  return (
    <Modal>
      <CandidateForm />
    </Modal>
  );
}
