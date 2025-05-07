import "./index.css";

const PopupCancel = ({ popupCancelInfo }) => {
  const {
    title,
    content,
    leftBtnText,
    rightBtnText,
    leftBtnAction,
    rightBtnAction,
  } = popupCancelInfo;

  return (
    <div className="popup-cancel-wrapper">
      <div className="popup-cancel">
        <div className="content-container">
          {title && <p className="title">{title}</p>}
          {content && <p className="content">{content}</p>}
        </div>
        <div className="actions">
          <button className="action" onClick={() => leftBtnAction()}>
            {leftBtnText}
          </button>
          <button
            className="action"
            onClick={() => rightBtnAction()}
            style={popupCancelInfo.rightBtnStyle}
          >
            {rightBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupCancel;
