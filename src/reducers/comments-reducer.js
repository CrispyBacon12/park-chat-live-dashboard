import { ADD_COMMENTS } from '../actions';

export function CommentsReducer(state = [], action) {
  switch(action.type) {
    case ADD_COMMENTS: return addComments(state, action)
  }

  return state;
}

function addComments(state, action) {
  if (containsBlackListedWord(action.message)) {
    action.message = 'This message has triggered the filter.';
  }

  // we want to merge with the existing state, excluding any comments that are being overriden
  // by this new payload, to avoid duplicates.
  const stateDifference = state.filter(comment => !action.payload.some(value => value.id === comment.id));
  return [...stateDifference, ...action.payload]
  .sort((a, b) => {
    return (a.created_time < b.created_time) ? 1 : (a.created_time > b.created_time) ? -1 : 0;
  });
}

function containsBlackListedWord(message) {
  const words = message.split(' ');
  return words.some(word => blackList.includes(word));
}

const blackList = [
  'thor', 'captain america', 'thanos', 'avengers', 'black widow', 'captain', 'cap', 'iron man', 'ironman', 'hawkeye', 'natasha', 'romanov', 'hulk', 'bruce', 'bruce banner', 'banner', 'tony stark', 'stark', 'tony', 'starlord', 'chris pratt', 'pratt', 'ratchet', 'groot', 'drax', 'gamora', 'peter quill', 'quill', 'nebula', 'yondu', 'nova', 'kraglin', 'kraglen', 'vision', 'infinity stone', 'infinity', 'gauntlet', 'asgard', 'asgardian', 'odin', 'loki', 'shield', 'agents of', 'scarlet witch', 'spiderman', 'black panther', 'peter parker', 'peter', 'falcon', 'scarlet', 'wanda', 'maximoff', 'hammer', 'jarvis', 'antman', 'ant-man', 'ant man', 'bucky', 'buckey', 'bucky barnes', 'barnes', 'winter solder', 'soldier', 'wakanda', 'wakanada', 'vibranium', 'valkyrie', 'korg', 'dies', 'kills'
];
