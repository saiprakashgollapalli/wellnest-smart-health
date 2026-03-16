import { useParams,useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { FiStar,FiMail,FiPhone,FiArrowLeft } from "react-icons/fi";
import { trainerService,reviewService,sessionService } from "../services/api";

export default function TrainerProfilePage(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer,setTrainer] = useState(null);
  const [reviews,setReviews] = useState([]);

  const [rating,setRating] = useState(5);
  const [comment,setComment] = useState("");

  const user = JSON.parse(localStorage.getItem("wellnest_user"));

  // NEW BOOKING STATES
  const [sessionDate,setSessionDate] = useState("");
  const [sessionTime,setSessionTime] = useState("");

  useEffect(()=>{

    trainerService.getById(id)
      .then(res => setTrainer(res.data))
      .catch(err => console.error(err));

    loadReviews();

  },[id]);

  const loadReviews = () => {

    reviewService.getByTrainer(id)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));

  };

  const submitReview = async () => {

  if (!comment.trim()) {
    alert("Please write a review");
    return;
  }

  if (!user || !user.userId) {
    alert("User not logged in");
    return;
  }

  try {

    await reviewService.create(
      id,
      user.userId,
      {
        rating,
        comment
      }
    );

    setComment("");
    setRating(5);

    loadReviews();

  } catch (err) {

    console.error(err);
    alert("Failed to submit review");

  }

};

  // NEW BOOK SESSION FUNCTION
  const bookSession = async () => {

    if(!sessionDate || !sessionTime){
      alert("Please select date and time");
      return;
    }

    if (!user || !user.userId) {
      alert("User not logged in");
      return;
    }

    try{

      await sessionService.book({
        trainerId: trainer.id,
        userId: user.userId,
        sessionDate: sessionDate,
        sessionTime: sessionTime
      });

      alert("Session booked successfully!");

      setSessionDate("");
      setSessionTime("");

    }catch(err){

      console.error(err);
      alert("Failed to book session");

    }

  };

  if(!trainer){
    return <div className="text-center py-20">Loading trainer...</div>;
  }

  return(

    <div className="max-w-[900px] mx-auto px-6 py-10">

      {/* BACK BUTTON */}

      <button
        onClick={()=>navigate(-1)}
        className="flex items-center gap-2 text-[var(--emerald)] mb-6"
      >
        <FiArrowLeft/> Back
      </button>

      {/* TRAINER HEADER */}

      <div className="flex items-center gap-6 mb-8">

        <div className="w-[80px] h-[80px] rounded-full bg-[var(--emerald)] flex items-center justify-center text-2xl font-bold">
          {trainer.name?.charAt(0)}
        </div>

        <div>

          <h1 className="text-2xl font-bold">
            {trainer.name}
          </h1>

          <p className="text-[var(--text-secondary)]">
            {trainer.specialization}
          </p>

          <p className="text-sm text-[var(--text-muted)] mt-1">
            {trainer.experienceYears} years experience
          </p>

        </div>

      </div>

      {/* ABOUT */}

      <div className="mb-8">

        <h2 className="text-lg font-semibold mb-2">
          About Trainer
        </h2>

        <p className="text-[var(--text-secondary)]">
          {trainer.bio}
        </p>

      </div>

      {/* CONTACT */}

      <div className="flex gap-3 mb-10">

      {trainer.email && (

  <a
    href={`mailto:${trainer.email}`}
    target="_blank"
    rel="noopener noreferrer"
    className="btn-ghost flex items-center gap-2 cursor-pointer"
  >
    <FiMail /> Email
  </a>

)}

        {trainer.phoneNumber && (

  <a
    href={`tel:${trainer.phoneNumber}`}
    className="btn-primary flex items-center gap-2 cursor-pointer"
  >
    <FiPhone /> Call
  </a>

)}

      </div>

      {/* REVIEWS */}

      <div className="mb-10">

        <h2 className="text-lg font-semibold mb-4">
          Reviews
        </h2>

        {reviews.length === 0 && (
          <p className="text-[var(--text-muted)]">
            No reviews yet
          </p>
        )}

        <div className="flex flex-col gap-4">

          {reviews.map(r => (

            <div
              key={r.id}
              className="border border-[var(--border)] rounded-lg p-4"
            >

              <div className="flex items-center gap-1 mb-1">

                {[1,2,3,4,5].map(i => (

                  <FiStar
                    key={i}
                    color={i <= r.rating ? "#fbbf24" : "#444"}
                    fill={i <= r.rating ? "#fbbf24" : "none"}
                  />

                ))}

              </div>

              <p className="text-sm font-medium">
                {r.user?.name}
              </p>

              <p className="text-sm text-[var(--text-secondary)]">
                {r.comment}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* ADD REVIEW */}

      <div>

        <h2 className="text-lg font-semibold mb-4">
          Add Review
        </h2>

        <div className="flex gap-1 mb-3">

          {[1,2,3,4,5].map(i => (

            <FiStar
              key={i}
              onClick={()=>setRating(i)}
              style={{
                cursor:"pointer",
                color: i <= rating ? "#fbbf24" : "#444",
                fill: i <= rating ? "#fbbf24" : "none"
              }}
            />

          ))}

        </div>

        <textarea
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full border border-[var(--border)] rounded-lg p-3 mb-3"
        />

        <button
          onClick={submitReview}
          className="btn-primary"
        >
          Submit Review
        </button>

      </div>

      {/* BOOK TRAINER SESSION */}

      <div className="mt-12">

        <h2 className="text-lg font-semibold mb-4">
          Book Training Session
        </h2>

        <div className="flex gap-3 mb-3">

          <input
            type="date"
            value={sessionDate}
            onChange={(e)=>setSessionDate(e.target.value)}
            className="border border-[var(--border)] rounded p-2"
          />

          <input
            type="time"
            value={sessionTime}
            onChange={(e)=>setSessionTime(e.target.value)}
            className="border border-[var(--border)] rounded p-2"
          />

        </div>

        <button
          onClick={bookSession}
          className="btn-primary"
        >
          Book Session
        </button>

      </div>

    </div>

  );

}