// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";

// const SectionFive = ({
//   prefilledTechnicalDetails,
// }: {
//   prefilledTechnicalDetails: any;
// }) => {
//   const [technicalDetails, setTechnicalDetails] = useState<any>({
//     technologyInput: "",
//     ...prefilledTechnicalDetails,
//   });

//   const changeTechnicalDetailsHandler = (e: any) => {
//     setTechnicalDetails({
//       ...technicalDetails,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="flex flex-col flex-1 gap-4 border-2 rounded-md p-4">
//       <div className="flex flex-col gap-2">
//         <div className="text-sm font-medium">
//           Company/University (Present):{" "}
//         </div>
//         <Input
//           type="url"
//           placeholder="Documenso / Stanford University"
//           value={technicalDetails.company}
//           name="company"
//           onChange={changeTechnicalDetailsHandler}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <div className="text-sm font-medium">
//           What's your current role/program:{" "}
//         </div>
//         <Input
//           type="url"
//           placeholder="Software Engineer / Computer Science"
//           value={technicalDetails.position}
//           name="position"
//           onChange={changeTechnicalDetailsHandler}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <div className="text-sm text-black">
//           Preferred Technologies/Domain:{" "}
//           <span className="text-red-500">(5 Max)</span>{" "}
//         </div>
//         <div className="flex gap-2">
//           <Input
//             value={technicalDetails.technologyInput}
//             placeholder="e.g., React"
//             onChange={(e) => {
//               setTechnicalDetails({
//                 ...technicalDetails,
//                 technologyInput: e.target.value,
//               });
//             }}
//           />
//           <Button
//             disabled={
//               !technicalDetails?.technologyInput ||
//               technicalDetails?.preferredTechStack?.length >= 5
//             }
//             onClick={() => {
//               if (
//                 technicalDetails.technologyInput &&
//                 !technicalDetails.preferredTechStack.includes(
//                   technicalDetails.technologyInput.trim()
//                 )
//               ) {
//                 setTechnicalDetails({
//                   ...technicalDetails,
//                   preferredTechStack: [
//                     ...technicalDetails.preferredTechStack,
//                     technicalDetails.technologyInput.trim(),
//                   ],
//                   technologyInput: "",
//                 });
//               }
//             }}
//           >
//             Add
//           </Button>
//         </div>

//         <div className="flex gap-2 flex-wrap mt-2">
//           {technicalDetails?.preferredTechStack?.map(
//             (tech: string, index: any) => (
//               <div
//                 key={index}
//                 className="flex items-center px-3 py-1 bg-gray-200 text-sm rounded-full gap-2"
//               >
//                 <span>{tech}</span>
//                 <button
//                   className="text-red-500"
//                   onClick={() => {
//                     const updatedTechnologies =
//                       technicalDetails?.preferredTechStack.filter(
//                         (item: string) => item !== tech
//                       );
//                     setTechnicalDetails({
//                       ...technicalDetails,
//                       preferredTechStack: updatedTechnologies,
//                     });
//                   }}
//                 >
//                   ✕
//                 </button>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <div className="text-sm font-medium">
//           What's your years of experience:{" "}
//         </div>
//         <Input
//           placeholder="5"
//           value={technicalDetails.yearsOfExperience}
//           name="yearsOfExperience"
//           type="number"
//           onChange={changeTechnicalDetailsHandler}
//         />
//       </div>
//     </div>
//   );
// };

// export default SectionFive;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postWithToken } from "@/config/API";
import { editTechnicalDetailsEndpoint } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { fetchUserData } from "@/lib/store/features/user/userSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

const SectionFive = ({
  prefilledTechnicalDetails,
}: {
  prefilledTechnicalDetails: any;
}) => {
  const [technicalDetails, setTechnicalDetails] = useState({
    technologyInput: "",
    ...prefilledTechnicalDetails,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const dispatch = useDispatch();

  const changeTechnicalDetailsHandler = (e: any) => {
    setTechnicalDetails({
      ...technicalDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setTechnicalDetails({
      technologyInput: "",
      ...prefilledTechnicalDetails,
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await postWithToken(editTechnicalDetailsEndpoint, {
        technicalDetails,
      });
      toast({ title: "Details saved successfully" });
      dispatch(fetchUserData());
    } catch (error: any) {
      console.log(error, "error");
      toast({
        title: "Uh oh!, Failed to save details",
        description: error?.data?.errorData,
        variant: "destructive",
      });
      setTechnicalDetails({
        technologyInput: "",
        ...prefilledTechnicalDetails,
      });
    } finally {
      setIsEditing(false);
      setLoading(false);
    }
  };

  const checkDisabled = () => {
    if (
      loading ||
      !technicalDetails?.company ||
      !technicalDetails?.position ||
      technicalDetails?.yearsOfExperience == undefined ||
      technicalDetails?.preferredTechStack?.length < 1
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col flex-1 gap-4 border-2 rounded-md p-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Technical Details</h3>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={checkDisabled()}>
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">Company/University (Present):</div>
        <Input
          type="url"
          placeholder="Documenso / Stanford University"
          value={technicalDetails.company}
          name="company"
          onChange={changeTechnicalDetailsHandler}
          disabled={!isEditing}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">
          What's your current role/program:
        </div>
        <Input
          type="text"
          placeholder="Software Engineer / Computer Science"
          value={technicalDetails.position}
          name="position"
          onChange={changeTechnicalDetailsHandler}
          disabled={!isEditing}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-black">
          Preferred Technologies/Domain:{" "}
          <span className="text-red-500">(5 Max)</span>
        </div>
        <div className="flex gap-2">
          <Input
            value={technicalDetails.technologyInput}
            placeholder="e.g., React"
            onChange={(e) => {
              setTechnicalDetails({
                ...technicalDetails,
                technologyInput: e.target.value,
              });
            }}
            disabled={!isEditing}
          />
          <Button
            disabled={
              !isEditing ||
              !technicalDetails?.technologyInput ||
              technicalDetails?.preferredTechStack?.length >= 5
            }
            onClick={() => {
              if (
                technicalDetails.technologyInput &&
                !technicalDetails.preferredTechStack.includes(
                  technicalDetails.technologyInput.trim()
                )
              ) {
                setTechnicalDetails({
                  ...technicalDetails,
                  preferredTechStack: [
                    ...technicalDetails.preferredTechStack,
                    technicalDetails.technologyInput.trim(),
                  ],
                  technologyInput: "",
                });
              }
            }}
          >
            Add
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap mt-2">
          {technicalDetails?.preferredTechStack?.map(
            (tech: string, index: number) => (
              <div
                key={index}
                className="flex items-center px-3 py-1 bg-gray-200 text-sm rounded-full gap-2"
              >
                <span>{tech}</span>
                {isEditing && (
                  <button
                    className="text-red-500"
                    onClick={() => {
                      const updatedTechnologies =
                        technicalDetails?.preferredTechStack.filter(
                          (item: string) => item !== tech
                        );
                      setTechnicalDetails({
                        ...technicalDetails,
                        preferredTechStack: updatedTechnologies,
                      });
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">
          What's your years of experience:
        </div>
        <Input
          placeholder="5"
          value={technicalDetails.yearsOfExperience}
          name="yearsOfExperience"
          type="number"
          onChange={changeTechnicalDetailsHandler}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

export default SectionFive;
