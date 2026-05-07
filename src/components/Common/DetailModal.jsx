import PropTypes from 'prop-types';
import { Modal, Table, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaPrint } from 'react-icons/fa';

const DetailModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, rowData = {}, excludeKey = [] } = props;

  const filteredDetails = Object.entries(rowData || {}).filter(
    ([key]) => !excludeKey.includes(key)
  );

  const printDetail = () => {
    const modalContent = document.getElementById('printable-content').innerHTML;
    const printWindow = window.open(
      '',
      '_blank',
      `width=${window.screen.width},height=${window.screen.height}`
    );
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>${t('Print Details')}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
          </style>
        </head>
        <body>
          ${modalContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Modal
      show={isOpen}
      onHide={toggle}
      centered
      size="xl"
      dialogClassName="mt-30px"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('View Details')}</Modal.Title>
      </Modal.Header>

      <Modal.Body id="printable-content">
        <Table bordered>
          <tbody>
            {filteredDetails.map(([key, value]) => (
              <tr key={key}>
                <td>
                  <strong>{t(`${key}`)}:</strong>
                </td>
                <td className="text-primary">{value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={printDetail} variant="success" className="me-2">
          <FaPrint className="align-middle" /> {t('Print')}
        </Button>
        <Button variant="secondary" onClick={toggle}>
          {t('Close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DetailModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  rowData: PropTypes.object.isRequired,
  excludeKey: PropTypes.arrayOf(PropTypes.string),
};

export default DetailModal;
