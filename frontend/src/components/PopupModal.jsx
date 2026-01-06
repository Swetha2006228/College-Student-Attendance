const PopupModal = ({ title, children, onClose, size = "md" }) => {
  const widthClass =
    size === "lg"
      ? "w-[700px] max-h-[90vh] overflow-y-auto"
      : size === "md"
      ? "w-[450px]"
      : "w-[350px]";

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
      <div
        className={`bg-[#0a0a0a] border border-blue-600 shadow-[0_0_25px_rgba(0,102,255,0.6)] rounded-xl p-6 relative ${widthClass}`}
      >
        <h2 className='text-white text-lg font-semibold mb-4 drop-shadow-[0_0_8px_rgba(0,150,255,0.8)]'>
          {title}
        </h2>

        {children}

        <button
          onClick={onClose}
          className='absolute top-2 right-3 text-white text-xl hover:text-red-400'
        >
          x
        </button>
      </div>
    </div>
  );
};

export default PopupModal;
