import React from "react";
import { SearchInput, useSearchState } from "./SearchInput";
import "./icons";
import Card from "./DataCard";

import styles from "./App.module.scss";

function App() {
  const search = useSearchState();
  return (
    <div className={styles.app}>
      <header>
        <SearchInput
          value={search.text}
          onChange={search.onChange}
          reset={search.reset}
        />
      </header>
      <main>
        {search.debouncedText ? (
          <Card text={search.debouncedText} />
        ) : (
          <div>Nothing to show</div>
        )}
      </main>
    </div>
  );
}

export default App;
