import React, { Component } from 'react';
import facebookConnector from '../services/facebook';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
  setError
} from '../actions';

export class AlertBar extends Component {
  constructor(props) {
    super(props);

    this.facebook = facebookConnector();
    this.facebook.subscribeErrors(err => {
      this.props.setError(err);
    });
  }

  render() {
    if (this.props.errors && this.props.errors.length > 0) {
      const error = this.props.errors[this.props.errors.length-1];

      return (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      );
    }

    return null;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setError
  }, dispatch);
}

function mapStateToProps({ errors }) {
  return { errors };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertBar)