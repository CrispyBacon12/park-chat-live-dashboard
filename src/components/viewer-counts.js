import React from 'react';

export default ({viewers}) => {
  return (
    <div className="mt-4 viewer-count">
      <div className="d-flex justify-content-between">
        <p className="h2"><span className="badge badge-primary">Facebook: {viewers.facebook}</span></p>
        <p className="h2"><span className="badge badge-danger">YouTube: {viewers.youtube}</span></p>
      </div>
      <div className="d-flex justify-content-center">
        <p className="mt-4 viewer-total">Total: {viewers.facebook + viewers.youtube}</p>
      </div>
    </div>
  );
};
