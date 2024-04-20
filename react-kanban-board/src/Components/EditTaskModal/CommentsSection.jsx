import React from "react";
import "./EditTaskModal.scss";

const CommentsSection = ({ comments }) => {
  return (
    <div className="comments-section">
      {comments.length > 0 && <h3 className="comments-heading">Comments</h3>}

      <div className="comment-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <div className="comment-header">
              <strong>{comment.name}</strong>
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
