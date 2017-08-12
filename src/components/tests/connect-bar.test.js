import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ConnectBar } from '../connect-bar';

describe('<ConnectBar />', () => {
  it('should have a form', () => {
    const wrapper = shallow(<ConnectBar />);
    expect(wrapper.find('form')).to.have.length(1);
  });

  it('should render with an empty input', () => {
    const wrapper = shallow(<ConnectBar />);
    const input = wrapper.find('input[type="text"]');

    expect(input).to.have.length(1);
    expect(input.prop('value')).to.equal('');
  });

  it('should have a submit button', () => {
    const wrapper = shallow(<ConnectBar />);
    const submit = wrapper.find('button[type="submit"]');
    expect(submit).to.have.length(1);
    expect(submit.text()).to.equal('Connect!');
  });

  it('should trigger stream connection on submit', () => {
    const mockComments = [];
    const mockFacebook = {
      connectToStream: sinon.spy((videoId, cb) => {
        cb(mockComments);
      })
    };

    const updateFacebookVideoSpy = sinon.spy();
    const addCommentsSpy = sinon.spy();
    const TEST_VIDEO_ID = 'abcdef123';

    const wrapper = shallow(<ConnectBar facebook={mockFacebook} updateFacebookVideo={updateFacebookVideoSpy} addComments={addCommentsSpy} />);

    wrapper.find('input[type="text"]').simulate('change', {target: { value: TEST_VIDEO_ID }});
    wrapper.find('form').simulate('submit', {
      preventDefault: sinon.spy()
    });

    expect(mockFacebook.connectToStream.calledOnce).to.be.true;
    expect(mockFacebook.connectToStream.calledWith(TEST_VIDEO_ID)).to.be.true;
    expect(addCommentsSpy.calledOnce).to.be.true;
    expect(addCommentsSpy.calledWith(mockComments)).to.be.true;
  });

  it('should trigger update facebook video action on submit', () => {
    const mockComments = [];
    const mockFacebook = {
      connectToStream: sinon.spy()
    };
    const TEST_VIDEO_ID = '1234abcef';
    
    const updateFacebookVideoSpy = sinon.spy();
    const wrapper = shallow(<ConnectBar facebook={mockFacebook} updateFacebookVideo={updateFacebookVideoSpy} />);

    wrapper.find('input[type="text"]').simulate('change', {target: { value: TEST_VIDEO_ID }});
    wrapper.find('form').simulate('submit', {
      preventDefault: sinon.spy()
    });

    expect(updateFacebookVideoSpy.calledOnce).to.be.true;
    expect(updateFacebookVideoSpy.calledWith(TEST_VIDEO_ID)).to.be.true;
  });
});
