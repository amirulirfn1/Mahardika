import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCSRF } from '@/lib/hooks/useCSRF';

interface DialogProps {
  customerId: string;
  show: boolean;
  onClose: () => void;
  onRedeemed?: (newBalance: number) => void;
}

const PointsRedeemDialog: React.FC<DialogProps> = ({ customerId, show, onClose, onRedeemed }) => {
  const [rmValue, setRmValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToFetchOptions, isLoading: csrfLoading } = useCSRF();

  const handleRedeem = async () => {
    if (rmValue <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/points/redeem', addToFetchOptions({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, value_rm: rmValue }),
      }));
      const data = await res.json();
      if (!res.ok) {
        // Handle CSRF-specific errors with user-friendly messages
        if (data.code === 'CSRF_TOKEN_MISSING' || data.code === 'CSRF_TOKEN_INVALID' || data.code === 'CSRF_TOKEN_MISMATCH') {
          throw new Error('Security verification failed. Please refresh the page and try again.');
        }
        throw new Error(data.error || 'Redeem failed');
      }
      onRedeemed?.(data.newBalance);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || rmValue <= 0 || csrfLoading;

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Redeem Points</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {csrfLoading && <div className="alert alert-info">Initializing security verification...</div>}
        <Form.Group controlId="rmValue">
          <Form.Label>Redeem Value (RM)</Form.Label>
          <Form.Control type="number" min={1} value={rmValue} onChange={(e) => setRmValue(parseFloat(e.target.value))} />
          <Form.Text className="text-muted">10 pts = RM 1</Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleRedeem} disabled={isButtonDisabled}>
          {loading ? 'Processing...' : 'Redeem'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PointsRedeemDialog; 