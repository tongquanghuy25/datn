const mongoose = require('mongoose')

const stopPointSchema = new mongoose.Schema(
    {
        province: { type: String, required: true },
        district: { type: String, required: true },
        location: { type: String, required: true }
    }
);
const StopPoint = mongoose.model('StopPoint', stopPointSchema);

module.exports = StopPoint;

// import React, { useState } from 'react';
// import { Select } from 'antd';

// const { Option } = Select;

// const ProvinceDistrictSelector = () => {
//   const [selectedProvince, setSelectedProvince] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);

//   const provinces = [
//     { id: 'province1', name: 'Tỉnh/Thành phố 1' },
//     { id: 'province2', name: 'Tỉnh/Thành phố 2' },
//     // Add other provinces here
//   ];

//   const districts = {
//     province1: [
//       { id: 'district1', name: 'Huyện 1' },
//       { id: 'district2', name: 'Huyện 2' },
//       // Add other districts of province1 here
//     ],
//     province2: [
//       { id: 'district3', name: 'Huyện 3' },
//       { id: 'district4', name: 'Huyện 4' },
//       // Add other districts of province2 here
//     ],
//     // Add other provinces and districts here
//   };

//   const handleProvinceChange = (value) => {
//     setSelectedProvince(value);
//     // Reset selectedDistrict when province changes
//     setSelectedDistrict(null);
//   };

//   const handleDistrictChange = (value) => {
//     setSelectedDistrict(value);
//   };

//   return (
//     <div>
//       <Select
//         style={{ width: 200 }}
//         placeholder="Chọn tỉnh"
//         onChange={handleProvinceChange}
//       >
//         {provinces.map((province) => (
//           <Option key={province.id} value={province.id}>
//             {province.name}
//           </Option>
//         ))}
//       </Select>
//       <Select
//         style={{ width: 200, marginLeft: 16 }}
//         placeholder="Chọn huyện"
//         value={selectedDistrict}
//         onChange={handleDistrictChange}
//         disabled={!selectedProvince}
//       >
//         {selectedProvince && districts[selectedProvince].map((district) => (
//           <Option key={district.id} value={district.id}>
//             {district.name}
//           </Option>
//         ))}
//       </Select>
//     </div>
//   );
// };

// export default ProvinceDistrictSelector;