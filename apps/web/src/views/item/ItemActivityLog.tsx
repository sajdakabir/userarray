// import { formattedDate } from "@/utils/helpers";

// type ItemActivity = {
//     _id: string;
//     verb: string;
//     comment: string;
//     attachments: string[];
//     oldIdentifier: null;
//     newIdentifier: null;
//     oldValue: string | null;
//     newValue: string | null;
//     space: string;
//     workspace: string;
//     item: string;
//     actor: {
//       userName: string;
//       fullName: string;
//     };
//     uuid: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
//   };

// type ItemActivityProps = {
//   itemActivity: ItemActivity[] | undefined;
// };

// const ItemActivityLog = ({ itemActivity }: ItemActivityProps) => {
//   return (
//     <div className="flex flex-col items-center justify-start h-full overflow-y-auto">
//       {itemActivity ? (
//         itemActivity.map((item) => (
//           <div
//             key={item._id}
//             className="w-full text-gray-300 flex flex-col py-2 justify-center gap-2 border-b border-gray-300"
//           >
//             <div className="flex items-center justify-between text-sm text-gray-300">
//               <div>
//                 <span className="font-semibold">
//                   {item.actor.userName || item.actor.fullName}
//                 </span>{" "}
//                 {item.verb} the item
//               </div>
//               <div className="text-xs text-gray-300">
//                 {formattedDate(item.createdAt)}
//               </div>
//             </div>
//             <div className="flex items-center justify-between text-sm">
//               <div className="flex flex-col">
//                 {item.oldValue && (
//                   <>
//                     <span className="font-semibold">Old Value</span>
//                     <span dangerouslySetInnerHTML={{ __html: item.oldValue }} />
//                   </>
//                 )}
//               </div>
//               <div className="flex flex-col">
//                 {item.newValue && (
//                   <>
//                     <span className="font-semibold">New Value</span>
//                     <span dangerouslySetInnerHTML={{ __html: item.newValue }} />
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-white">Loading...</p>
//       )}
//     </div>
//   );
// };

// export default ItemActivityLog;









function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
 
type ItemActivity = {
    _id: string;
    verb: string;
    comment: string;
    attachments: string[];
    oldIdentifier: null;
    newIdentifier: null;
    oldValue: string | null;
    newValue: string | null;
    space: string;
    workspace: string;
    item: string;
    actor: {
      userName: string;
      fullName: string;
    };
    uuid: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  
type ItemActivityProps = {
  itemActivity: ItemActivity[] | undefined;
};

// const activityMessages = {
//   description: (activity: ItemActivity) => (
//     <span>
//     <strong>@{activity.actor.userName || activity.actor.fullName}</strong>  updated the description
//   </span>
//   ),
//   name: (activity: ItemActivity) => (
// //     <div>
// //     <span className="font-semibold">@{activity.actor.userName || activity.actor.fullName}</span> set the name to {activity.newValue}
// //   </div>
//     <span>
//     <strong className="font-semibold">@{activity.actor.userName || activity.actor.fullName}</strong>  set the name to {activity.newValue}
//   </span>
//   ),
//   effort: (activity: ItemActivity) => (
//     <span>
//     <strong>@{activity.actor.userName || activity.actor.fullName}</strong> set the Effort to{" "}
//         <span className="font-medium text-custom-text-100">
//           {activity.newValue ? capitalizeFirstLetter(activity.newValue) : "None"}
//         </span>
//   </span>
//   ),
//   status: (activity: ItemActivity) => (
//     <span>
//     <strong>@{activity.actor.userName || activity.actor.fullName}</strong> set the Effort to{" "}
//         <span className="font-medium text-custom-text-100">
//           {activity.newValue ? capitalizeFirstLetter(activity.newValue) : "None"}
//         </span>
//   </span>
//   ),
//   dueDate: (activity: ItemActivity) => {
//     const formattedDate = activity.newValue ? new Date(activity.newValue).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: '2-digit'
//     }) : null;
  
//     return (
//       <span>
//         {activity.newValue ? (
//           <span>
//             <strong>@{activity.actor.userName || activity.actor.fullName}</strong> set the due date to{" "}
//             <span className="font-medium text-custom-text-100">{formattedDate}</span>
//           </span>
//         ) : (
//           <span>
//             <strong>{activity.actor.userName || activity.actor.fullName}</strong> removed the due date
//           </span>
//         )}
//       </span>
//     );
//   },
//   assignees: (activity: ItemActivity) => {

//     return (
//       <span>
//         {activity.oldValue ? (
//           <span>
//             <strong>@{activity.actor.userName || activity.actor.fullName}</strong>  removed the assignee {activity.oldValue}
//             <span className="font-medium text-custom-text-100">{}</span>
//           </span>
//         ) : (
//           <span>
//             <strong>@{activity.actor.userName || activity.actor.fullName}</strong> added a new assignee {activity.newValue}
//           </span>
//         )}
//       </span>
//     );
//   },
//   labels: (activity: ItemActivity) => {
//     return (
//       <span>
//         {activity.oldValue ? (
//           <span>
//             <strong>@{activity.actor.userName || activity.actor.fullName}</strong>  removed the label {activity.oldValue}
//             <span className="font-medium text-custom-text-100">{}</span>
//           </span>
//         ) : (
//           <span>
//             <strong>@{activity.actor.userName || activity.actor.fullName}</strong> added a new label {activity.newValue}
//           </span>
//         )}
//       </span>
//     );
//   },
//   item: (activity: ItemActivity) => (
//     <span>
//     <strong>@{activity.actor.userName || activity.actor.fullName}</strong> created the item
//   </span>
//   ),
 
   
//   // Add more activity types as needed
// };

const activityMessages = {
    description: (activity: ItemActivity) => (
      <span>
        <strong>@{activity.actor.userName || activity.actor.fullName}</strong> 
        <span style={{ color: '#6b7280' }}> updated the description</span> 
      </span>
    ),
    name: (activity: ItemActivity) => (
      <span>
        <strong className="font-semibold">@{activity.actor.userName || activity.actor.fullName}</strong><span style={{ color: '#6b7280' }}> set the name to</span>  {activity.newValue}
      </span>
    ),
    effort: (activity: ItemActivity) => (
      <span>
        <strong>@{activity.actor.userName || activity.actor.fullName}</strong> <span style={{ color: '#6b7280' }}> set the Effort to </span>{" "}
        <span className="font-medium text-custom-text-100">
          {activity.newValue ? capitalizeFirstLetter(activity.newValue) : "None"}
        </span>
      </span>
    ),
    status: (activity: ItemActivity) => (
      <span>
        <strong>@{activity.actor.userName || activity.actor.fullName}</strong>
        <span style={{ color: '#6b7280' }}> set the Status to</span>{" "}
        <span className="font-medium text-custom-text-100">
          {activity.newValue ? capitalizeFirstLetter(activity.newValue) : "None"}
        </span>
      </span>
    ),
    dueDate: (activity: ItemActivity) => {
      const formattedDate = activity.newValue ? new Date(activity.newValue).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }) : null;
    
      return (
        <span>
          {activity.newValue ? (
            <span>
              <strong>@{activity.actor.userName || activity.actor.fullName}</strong>
              <span style={{ color: '#6b7280' }}> set the due date to</span> {" "}
              <span className="font-medium text-custom-text-100">{formattedDate}</span>
            </span>
          ) : (
            <span>
              <strong>@{activity.actor.userName || activity.actor.fullName}</strong>
              <span style={{ color: '#6b7280' }}> removed the due date</span> 
            </span>
          )}
        </span>
      );
    },
    assignees: (activity: ItemActivity) => (
      <span>
        {activity.oldValue ? (
          <span>
            <strong>@{activity.actor.userName || activity.actor.fullName}</strong> 
            <span style={{ color: '#6b7280' }}> removed the assignee</span> {activity.oldValue}
          </span>
        ) : (
          <span>
            <strong>@{activity.actor.userName || activity.actor.fullName}</strong> 
            <span style={{ color: '#6b7280' }}> added a new assignee</span> {activity.newValue}
          </span>
        )}
      </span>
    ),
    labels: (activity: ItemActivity) => (
      <span>
        {activity.oldValue ? (
          <span>
            <strong>@{activity.actor.userName || activity.actor.fullName}</strong> 
            <span style={{ color: '#6b7280' }}> removed the label</span>{" "}
            <span className="font-medium text-custom-text-100">{activity.oldValue}</span>
          </span>
        ) : (
          <span>
            <strong>@{activity.actor.userName || activity.actor.fullName}</strong> 
            <span style={{ color: '#6b7280' }}>  added a new label</span>{" "}
            <span className="font-medium text-custom-text-100">{activity.newValue}</span>
          </span>
        )}
      </span>
    ),
    item: (activity: ItemActivity) => (
      <span>
        <strong>@{activity.actor.userName || activity.actor.fullName}</strong> <span style={{ color: '#6b7280' }}>created the item</span>
      </span>
    ),
  };
  


const ItemActivityLog = ({ itemActivity }: ItemActivityProps) => {
  return (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto">
      {itemActivity ? (
        itemActivity.map((activity) => (
          <div
            key={activity._id}
            className="w-full text-gray-300 flex flex-col py-1 justify-center gap-1"
          >
            <div className="flex items-center justify-between text-sm text-gray-300">
              <div>{activityMessages[activity.field] ? activityMessages[activity.field](activity) : null}</div>
              {/* <div className="text-xs text-gray-300">
                {formattedDate(activity.createdAt)}
              </div> */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
};

export default ItemActivityLog;

