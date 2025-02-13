function App() {
  return (
    <>
      <h2>react</h2>
      <div style={{ background: "black" }}>
        <svg style={{ fill: "red" }}>
          <use href={`/sprite/sprite.svg#del`} />
        </svg>
      </div>
    </>
  );
}

export default App;
