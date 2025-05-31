function App() {
  function zoom(e) {
    const img = e.currentTarget.querySelector("img");
    const rect = img.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Вычисляем смещение
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
  }

  return (
    <div className="container">
      <h2 className="title">react</h2>
      <div className="zoom-container" onMouseMove={(e) => zoom(e)}>
        <img
          src="https://avatars.dzeninfra.ru/get-zen_doc/8269145/pub_641ec1d0798be415157b4180_641f3d1cd4b1f54fcf2f0a01/scale_1200"
          alt=""
        />
      </div>
    </div>
  );
}

export default App;
