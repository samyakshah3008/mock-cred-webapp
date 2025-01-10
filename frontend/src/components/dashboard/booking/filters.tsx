"use client";

const Filters = ({ setCurrentEventStatus, setCurrentRole }: any) => {
  const changeCurrentEventStatus = (status: string) => {
    setCurrentEventStatus(status);
  };

  return (
    <div className="flex gap-2 m-auto w-[80%] items-center justify-center mt-10">
      <div onClick={() => changeCurrentEventStatus("upcoming")}>Upcoming</div>
      <div onClick={() => changeCurrentEventStatus("unconfirmed")}>
        Unconfirmed
      </div>
      <div onClick={() => changeCurrentEventStatus("past")}>Past</div>
      <div onClick={() => changeCurrentEventStatus("canceled")}>Canceled</div>
      <div onClick={() => changeCurrentEventStatus("approved")}>Approved</div>
      <div onClick={() => changeCurrentEventStatus("role")}>Role</div>

      <div onClick={() => setCurrentRole("interviewee")}>Interviewee</div>
      <div onClick={() => setCurrentRole("interviewer")}>Interviewer</div>
    </div>
  );
};

export default Filters;
