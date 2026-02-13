package com.example.ims.features.notice.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import com.example.ims.features.notice.dto.NoticeListResponse;
import com.example.ims.features.notice.dto.NoticeUpdateRequest;
import com.example.ims.features.user.dto.UserPrincipal;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.ims.features.notice.dto.DownloadRequest;
import com.example.ims.features.notice.dto.NoticeCreateRequest;
import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.services.NoticeCreate;
import com.example.ims.features.notice.services.NoticeDelete;
import com.example.ims.features.notice.services.NoticeDetail;
import com.example.ims.features.notice.services.NoticeEdit;
import com.example.ims.features.notice.services.NoticeList;
import com.example.ims.features.notice.services.NoticePinnedUpdate;
import com.example.ims.global.response.ApiResponse;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {

	private final static String uploadDir 
		= "C:\\Users\\andbe\\OneDrive\\Desktop\\ims_prj\\ImsProject\\server\\ims-server\\src\\main\\resources\\static\\uploads";
	
    @Resource
    NoticeList nList;

    @Resource
    NoticeDetail nDetail;

    @Resource
    NoticeCreate nCreate;

    @Resource
    NoticeDelete nDelete;
    
    @Resource
    NoticeEdit nEdit;

    @Resource
    NoticePinnedUpdate nPinned;

    // GetMapping 부분
    @GetMapping("/list")
    public NoticeListResponse getNotices(
        @RequestParam(value = "page", defaultValue = "1") Integer page,
        @RequestParam(value = "search", required = false) String search
    ) {
//    	System.out.println(search);
        return nList.execute(page, search);
    }

    @GetMapping("/{id}")
    NoticeResponse detail(@PathVariable("id") Long id) {
        NoticeResponse notice = nDetail.execute(id);
        System.out.println(notice);
        return notice;
    }

    @PostMapping(value = "/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> post(
         NoticeCreateRequest notice,
        @AuthenticationPrincipal UserPrincipal user
    ) {
    	
    	//System.out.println("NoticeCreate 진입ewfewf"+notice);
       return nCreate.execute(user.userId(), notice);
    	 //return null;
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable("id") Long id) {
        return nDelete.execute(id);
    }

    @PatchMapping("/{id}/pinned")
    public ApiResponse<Void> pinned(@PathVariable("id") Long id, @RequestParam boolean pinned) {
        System.out.println("수정 폼 들어옴");

        return nPinned.execute(id, pinned);
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> patchNotice(
        @PathVariable("id") Long id,
        @RequestPart("notice") NoticeUpdateRequest notice
       
    ) {
    	
    	
        System.out.println(id + ", " + notice );
        return nEdit.execute(id, notice);
    }
    
    @PostMapping("file/download")
    public void downloadFile(
		@RequestBody DownloadRequest request,
		HttpServletResponse response
	) throws IOException {
    	File file = new File(request.getFileName());
    	
		response.setContentType("application/download");
	    response.setContentLength((int) file.length());
	    response.setHeader("Content-disposition", "attachment;filename=\"" + file + "\"");
	    // response 객체를 통해서 서버로부터 파일 다운로드
	    OutputStream os = response.getOutputStream();
	    // 파일 입력 객체 생성
	    FileInputStream fis = new FileInputStream(file);
	    FileCopyUtils.copy(fis, os);
	    fis.close();
	    os.close();
    }
}
