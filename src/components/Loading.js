function Loading({ messageLoading, erroLoading }) {
  return (
    <div className="loading w-100 text-center p-5">
      <img src={require("../assets/loading.png")} alt="Loading..." />
      <label className="font-size-16 d-block m-4">{messageLoading}</label>
      {erroLoading.error && (
        <div className="invalid-feedback font-size-14 text-gold d-block">
          {erroLoading.alert}
          <hr />
          Return Message: {erroLoading.error.message}
        </div>
      )}
    </div>
  );
}

export default Loading;
