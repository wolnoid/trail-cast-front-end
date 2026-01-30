import { useState, useEffect } from 'react';

const CommentForm = (props) => {
  const [formData, setFormData] = useState({ text: ''});

  //editing 

    useEffect(() => {
      if (props.editingComment) {
        setFormData({ text: props.editingComment.text });
      } else {
      setFormData({ text: '' });
      }
    }, [props.editingComment]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!formData.text.trim()) return;//manages empty text

    try {
      if (props.editingComment) {
        await props.handleUpdateComment
          ? await props.handleUpdateComment({ ...props.editingComment, text: formData.text })
          : null;
        props.setEditingComment(null); // exit edit mode
      } else {
        await props.handleAddComment(formData);
        setFormData({ text: '' });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save comment. Please try again.');
    }
  };

  const handleCancel = () => {
    props.setEditingComment(null);
    setFormData({ text: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='text-input'>Make a comment:</label>
      <textarea
        required
        type='text'
        name='text'
        id='text-input'
        value={formData.text}
        onChange={handleChange}
      />
      <div>
        <button type='submit'>{props.editingComment ? 'Update' : 'Add'}</button>
        {props.editingComment && (
          <button type='button' onClick={handleCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;


