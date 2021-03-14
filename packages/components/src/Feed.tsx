import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "./DataCard";
import useKnownWords from "./use-known-words";
import { WordList } from "./internal-types";

type Props = {
  dark: boolean;
  exclude: string[];
  wordList: WordList;
};

const Feed: React.FC<Props> = ({ dark, exclude, wordList }) => {
  const pageSize = 2;
  const knownWords = useKnownWords();
  const allWords = useMemo(
    () =>
      _.filter(
        _.uniqBy(
          _.orderBy(
            _.flatten(
              _.map(
                wordList.categories.map((c) =>
                  c.words.map((w) => ({
                    category: c.name,
                    text: w.text,
                    freq: w.freq,
                  }))
                )
              )
            ),
            (t) => t.freq,
            "desc"
          ),
          (t) => t.text
        ),
        (t) => !knownWords.has(t.text)
      ),
    [wordList, knownWords]
  );

  const [words, setWords] = useState<typeof allWords>([]);

  useEffect(() => {
    const init = allWords.slice(0, pageSize);
    if (!_.isEqual(words, init)) {
      setWords(init);
    }
  }, [words, allWords]);

  const loadMore = () => {
    setTimeout(() => {
      setWords(allWords.slice(0, words.length + pageSize));
    }, 0);
  };

  const items = words
    .filter((w) => !knownWords.has(w.text))
    .map((w) => {
      return (
        <Card
          key={w.text}
          text={w.text}
          lang="en"
          dark={dark}
          exclude={exclude}
        />
      );
    });
  return (
    <InfiniteScroll
      dataLength={words.length}
      next={loadMore}
      hasMore={words.length < allWords.length}
      loader={<div></div>}
    >
      {items}
    </InfiniteScroll>
  );
};

export default Feed;
