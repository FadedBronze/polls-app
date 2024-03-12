function getIdCreator() {
  let count = 0;

  return function genId() {
    count++;

    return "" + count;
  };
}

const genId = getIdCreator();

export default genId;
