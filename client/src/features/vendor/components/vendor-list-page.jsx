// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchVendors } from '@/services/api';

// export function VendorListPage() {
//   const [vendors, setVendors] = useState([]);
//   const [pageData, setPageData] = useState({
//     number: 0,
//     totalPages: 0,
//     totalElements: 0,
//   });

//   const navigate = useNavigate();

//   const [page, setPage] = useState(0);
//   const [keyword, setKeyword] = useState('');
//   const [type, setType] = useState('');

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [keywordInput, setKeywordInput] = useState('');

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     fetchVendors({
//       page,
//       ...(keyword && { keyword }),
//       ...(type && { type }),
//     })
//       .then((res) => {
//         setVendors(res.content ?? []);
//         setPageData({
//           number: res.number,
//           totalPages: res.totalPages,
//           totalElements: res.totalElements,
//         });
//       })
//       .catch((e) => {
//         console.error(e);
//         setError(e?.message ?? String(e));
//       })
//       .finally(() => setLoading(false));
//   }, [page, keyword, type]);

//   const onSearch = () => {
//     setPage(0);
//     setKeyword(keywordInput.trim());
//   };

//   const goPrev = () => {
//     if (page > 0) setPage(page - 1);
//   };

//   const goNext = () => {
//     if (page < pageData.totalPages - 1) setPage(page + 1);
//   };

//   const goToPage = (p) => {
//     if (p >= 0 && p < pageData.totalPages) setPage(p);
//   };

//   if (loading) return <div>로딩중...</div>;
//   if (error) return <div style={{ color: 'red' }}>에러: {error}</div>;

//   return (
//     <div>
//       <h1>거래처 목록</h1>

//       {/* <div style={{ marginBottom: 10 }}>
//         <select value={type} onChange={(e) => { setPage(0); setType(e.target.value); }}>
//           <option value="">전체</option>
//           <option value="Supplier">공급처</option>
//           <option value="Seller">판매처</option>
//         </select>

//         <input
//           value={keywordInput}
//           onChange={(e) => setKeywordInput(e.target.value)}
//           placeholder="거래처명 검색"
//         />
//         <button onClick={onSearch}>검색</button>
//       </div> */}


//       <table border="1" width="100%">
//         <thead>
//           <tr>
//             <th>구분</th>
//             <th>거래처명</th>
//             <th>전화번호</th>
//             <th>이메일</th>
//             <th>주소</th>
//           </tr>
//         </thead>
//         <tbody>
//           {vendors.map((v) => (
//             <tr key={v.id}>
//               <td>{v.type === 'Supplier' ? '공급처' : '판매처'}</td>
//               <td>{v.vendorNamel ?? v.vendorName}</td>
//               <td>{v.telephone}</td>
//               <td>{v.email}</td>
//               <td>{v.address}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div style={{ marginTop: 12 }}>
//   <button onClick={() => navigate('/dashboard/vendor/create')}>
//     거래처 등록
//   </button>
// </div>
//       </div>


// );


//       {/* <div style={{ marginTop: 10 }}>
//         <button onClick={goPrev} disabled={page === 0}>[이전]</button><span>  </span>

//         {Array.from({ length: pageData.totalPages }, (_, i) => (
//           <button
//             key={i}
//             onClick={() => goToPage(i)}
//             disabled={i === page}
//           >
//             [{i + 1}]
//           </button>

//         ))}
//         <span>  </span>
//         <button
//           onClick={goNext}
//           disabled={page >= pageData.totalPages - 1}
//         >
//           [다음]
//         </button>

//         <span style={{ marginLeft: 10 }}>
//           (총 {pageData.totalElements}개 / {pageData.totalPages}페이지)
//         </span>
//       </div>
//     </div>
//   );
// } */}





// // 공급/판매처, 거래처명, 전화번호, 이메일, 주소

// }

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchVendors } from "@/services/api";

// shadcn/ui
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * @typedef {"Supplier" | "Seller"} VendorType
 */

/**
 * @typedef {Object} Vendor
 * @property {number|string} id
 * @property {VendorType} type
 * @property {string=} vendorName
 * @property {string=} vendorNamel  // 기존 오타 필드 호환 (있으면 우선 사용)
 * @property {string=} telephone
 * @property {string=} email
 * @property {string=} address
 */

/**
 * Spring Pageable 형태 응답 가정
 * @typedef {Object} VendorPageResponse
 * @property {Vendor[]=} content
 * @property {number} number
 * @property {number} totalPages
 * @property {number} totalElements
 */

export const VendorListPage = () => {
  const navigate = useNavigate();

  // UI 상태
  const [page, setPage] = useState(0);
  /** @type {[VendorType | "", Function]} */
  const [type, setType] = useState("");
  const [keyword, setKeyword] = useState("");

  const params = useMemo(
    () => ({
      page,
      ...(keyword ? { keyword } : {}),
      ...(type ? { type } : {}),
    }),
    [page, keyword, type]
  );

  /** @type {import("@tanstack/react-query").UseQueryResult<VendorPageResponse, Error>} */
  const query = useQuery({
    queryKey: ["vendors", params],
    queryFn: () => fetchVendors(params),
    placeholderData: (prev) => prev, // keepPreviousData 대체 (v5 스타일)
    staleTime: 30_000,
  });

  const { data } = query;

  /** @type {Vendor[]} */
  const vendors = data?.content ?? [];


  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">거래처 목록</h1>
      </div>

      {/* 필터/검색 */}
      

      {/* 테이블 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">구분</TableHead>
              <TableHead>거래처명</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>주소</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((v) => (
                <TableRow key={v.id} onClick={() => navigate('/dashboard/vendor/' + v.id)}>
                  <TableCell>
                    {v.type === "Supplier" ? "공급처" : "판매처"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {v.vendorNamel ?? v.vendorName ?? "-"}
                  </TableCell>
                  <TableCell>{v.telephone ?? "-"}</TableCell>
                  <TableCell>{v.email ?? "-"}</TableCell>
                  <TableCell>{v.address ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}

      <div>
        <Button onClick={() => navigate("/dashboard/vendor/create")}>
          거래처 등록
        </Button>
      </div>
    </div>
  );
}
