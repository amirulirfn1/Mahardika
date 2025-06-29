import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

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

  const handleRedeem = async () => {
    if (rmValue <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, value_rm: rmValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Redeem failed');
      onRedeemed?.(data.newBalance);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Redeem Points</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
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
        <Button variant="primary" onClick={handleRedeem} disabled={loading || rmValue <= 0}>
          {loading ? 'Processing...' : 'Redeem'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PointsRedeemDialog; 