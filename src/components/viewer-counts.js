import React from 'react';

export default ({viewers}) => {
  return (
    <div className="mt-4 d-flex justify-content-between">
      <div className="d-flex justify-content-start">
        <p className="h3 mr-4"><span className="badge badge-primary">Facebook: {viewers.facebook}</span></p>
        <p className="h3"><span className="badge badge-danger">YouTube: {viewers.youtube}</span></p>
      </div>
      <div>
        <p className="h3"><span className="badge badge-default">Total: {viewers.facebook + viewers.youtube}</span></p>
      </div>
    </div>
  );
};
