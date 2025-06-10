import React from "react";

interface NewBoardCardProps {
  onClick: () => void;
}

const NewBoardCard: React.FC<NewBoardCardProps> = ({ onClick }) => {
  return (
    <div
  onClick={onClick}
  className="card image-full w-full min-h-[14rem] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-transform duration-200 ease-in-out cursor-pointer group"
>
  <figure>
    <img
      src="/img/undraw_scrum-board_uqku.png"
      alt="Tạo mới"
      className="object-cover w-full h-full"
    />
  </figure>

  <div className="card-body bg-black bg-opacity-40 flex flex-col items-center justify-center text-white transition">
    <div className="text-5xl font-bold text-primary group-hover:scale-125 transition-transform duration-200">+</div>
    <p className="text-lg font-semibold text-primary group-hover:underline">Thêm Dự Án Mới</p>
  </div>
</div>

  );
};

export default NewBoardCard;
