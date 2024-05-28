// {
//     activeTab === 'busOwner' ?
//         <>
//             <span >Tên nhà xe</span>
//             <Input
//                 style={{ marginBottom: '20px', marginTop: '10px' }}
//                 value={PartnerEditing?.busOwnerName}
//                 onChange={(e) => {
//                     setPartnerEditing((pre) => {
//                         return { ...pre, busOwnerName: e.target.value }
//                     })
//                 }}
//             />
//         </>
//         :
//         <>
//             <span >Tên đại lý</span>
//             <Input
//                 style={{ marginBottom: '20px', marginTop: '10px' }}
//                 value={PartnerEditing?.agentName}
//                 onChange={(e) => {
//                     setPartnerEditing((pre) => {
//                         return { ...pre, agentName: e.target.value }
//                     })
//                 }}
//             />
//         </>
// }
// <span>Địa chỉ</span>
// <Input
//     style={{ marginBottom: '20px', marginTop: '10px' }}
//     value={PartnerEditing?.address}
//     onChange={(e) => {
//         setPartnerEditing((pre) => {
//             return { ...pre, address: e.target.value }
//         })
//     }}
// />