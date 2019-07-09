const replaceEmoji = str => {
  for (let i = 128512; i <= 128591; i++) {
    const s1 = String.fromCodePoint(i);
    const s2 = `<img class="emoji-img" src="https://marmeladies.com//media/images/smiles/emoji/${i}.gif" alt="" title="">`;
    str = str.replace(s1, s2);
  }
  return str;
};

export default replaceEmoji;
