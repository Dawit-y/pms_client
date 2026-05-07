import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCog,
  FaCopy,
  FaMagic,
  FaPaperclip,
  FaStickyNote,
  FaGavel,
  FaPlus,
} from 'react-icons/fa';

import IconButton from './IconButton';

const ActionsCell = ({
  id,
  rowData,
  onView,
  onAdd,
  onEdit,
  onDelete,
  onCanvasToggle,
  onDuplicate,
  onAttachFile,
  onAttachNote,
  onAiAnalysis,
  onApprove,
}) => {
  return (
    <div className="d-flex gap-2">
      {onAiAnalysis !== undefined && (
        <IconButton
          icon={<FaMagic />}
          onClick={() => onAiAnalysis(rowData || id)}
          className="text-purple"
          data-tooltip="AI Analysis"
          style={{ color: '#7c3aed' }}
        />
      )}
      {onApprove !== undefined && (
        <IconButton
          icon={<FaGavel />}
          onClick={() => onApprove(rowData || id)}
          className="text-success"
          data-tooltip="Approve"
        />
      )}
      {onCanvasToggle !== undefined && (
        <IconButton
          icon={<FaCog />}
          onClick={() => onCanvasToggle(id)}
          className="text-info"
          data-tooltip="Settings"
        />
      )}
      {onView !== undefined && (
        <IconButton
          icon={<FaEye />}
          onClick={() => onView(id)}
          className="text-primary"
          data-tooltip="View"
        />
      )}
      {onDuplicate !== undefined && (
        <IconButton
          icon={<FaCopy />}
          onClick={() => onDuplicate(id)}
          className="text-warning"
          data-tooltip="Duplicate"
        />
      )}
      {onAdd !== undefined && (
        <IconButton
          icon={<FaPlus />}
          onClick={() => onAdd(id)}
          className="text-success"
          data-tooltip="Add"
        />
      )}
      {onEdit !== undefined && (
        <IconButton
          icon={<FaEdit />}
          onClick={() => onEdit(id)}
          className="text-success"
          data-tooltip="Edit"
        />
      )}
      {onDelete !== undefined && (
        <IconButton
          icon={<FaTrash />}
          onClick={() => onDelete(id)}
          className="text-danger"
          data-tooltip="Delete"
        />
      )}
      {onAttachFile !== undefined && (
        <IconButton
          icon={<FaPaperclip />}
          onClick={() => onAttachFile(id)}
          className="text-secondary"
          data-tooltip="Attach File"
        />
      )}
      {onAttachNote !== undefined && (
        <IconButton
          icon={<FaStickyNote />}
          onClick={() => onAttachNote(id)}
          className="text-info"
          data-tooltip="Attach Note"
        />
      )}
    </div>
  );
};

export default ActionsCell;
