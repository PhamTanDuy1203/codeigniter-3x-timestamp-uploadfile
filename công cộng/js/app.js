var app = angular.module('myApp', ['thatisuday.dropzone']);

var maxImageWidth = 10000, maxImageHeight = 10000;

app.config(function (dropzoneOpsProvider) {
    dropzoneOpsProvider.setOptions({
        acceptedFiles: 'image/jpeg, images/jpg, image/png',
        addRemoveLinks: true,
        dictDefaultMessage: 'Click hoặc kéo thả hình vào đây',
        dictRemoveFile: 'Xóa hình',
        dictResponseError: 'Không thể upload được hình',
        dictFileTooBig: "Dung lượng {{filesize}}MB vượt mức cho phép: {{maxFilesize}}MB.",
        dictInvalidFileType: "Chỉ tải lên hình ảnh.",
        dictCancelUpload: "Hủy tải lên",
		dictCancelUploadConfirmation: "Bạn có chắc là hủy tải lên?",
		init: function () {
			this.on("success", function (file, responseText) {
				file.previewTemplate.setAttribute('id', responseText[0].id);
			});
			this.on("thumbnail", function (file) {
				if (file.status !== 'error' && (file.rejectDimensions !== undefined || file.acceptDimensions !== undefined)) {
					if (file.width > maxImageWidth || file.height > maxImageHeight) {
						file.rejectDimensions()
					}
					else {
						file.acceptDimensions();
					}
				}
			});
		},
		accept: function (file, done) {
			file.acceptDimensions = done;
			file.rejectDimensions = function () { done("Hình ảnh vượt quá kích thước cho phép: " + maxImageWidth + "x" + maxImageHeight); };
		}
    });
});

Dropzone.autoDiscover = false;

Array.prototype.removeByValue = function () {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};

app.controller('MainCtrl', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
	
    $scope.citys = [
        'TP.Rạch Giá',
        'TP.Hà Tiên',
        'H.Hòn Đất',
        'H.Kiên Lương',
        'H.Châu Thành',
        'H.Giồng Riềng',
        'H.Gò Quao',
    ];

    $scope.updateCity = function () {
        let index = $scope.citys.indexOf($scope.selected_city);
        $scope.selected_store = null;
        $scope.stores = [];
        
        if(index == 0){
            $scope.stores = [
                'BHX 94 Quang Trung',
                'BHX 219 Nguyễn Bĩnh Khiêm',
                '186-188 Nguyễn Hùng Sơn',
                '37 Đường 3/2',
                '79 Quang Trung',
            ];
        }
        if(index == 1){
            $scope.stores = [
                '95 Hóc Môn',
            ];
        }
    }

	var get_list_file = function () {
		$http.get(BASE_URL + "index.php/home/get_list_file?typeResult=json").then(function (response) {
			if (response) {
				
			} else {
				toastr.error("Không nhận được phản hồi từ máy chủ, vui lòng thử lại (js).");
			}

			var dataResult = [];
			dataResult = (response.data);
			
			/* dropzone */
			$scope.myDz.removeAllFiles(); pathFile = [];
			
			if (dataResult != null && dataResult != "") {
				$scope.mockFiles = [];
				$.each(dataResult, function (i, e) { // .split(",")
					if (e != null && e != "") {
						pathFile.push('./public/uploads/' + e);
						var fileName = e.substr(e.lastIndexOf("\\") + 1, e.length - e.lastIndexOf("\\"));
						var mock = { flink: './public/uploads/' + e, name: fileName, isMock: true, serverImgUrl: BASE_URL + 'public/uploads/' + e }; // .substr(1, e.length)
						$scope.mockFiles.push(mock);
					}
				});
			}
			else {
				$scope.myDz.removeAllFiles();
				$scope.mockFiles = [];
			}
			bindMockFile();
		});
	};
	get_list_file();

	$scope.time_change = function(){
		var time = $scope.txt_time;
		i = 0;
		date = moment(time, "'DD/MM/YYYY hh:mm A'");
		dateAdd = moment(time, "'DD/MM/YYYY hh:mm A'");
	}

	$scope.delete_all = function(){
		$scope.myDz.removeAllFiles(); pathFile = [];
		$scope.mockFiles = [];
		bindMockFile();
	}

	$scope.download_all = function(){
		if(pathFile.length == 1){
			force_download(pathFile[0]);
		}
		if(pathFile.length > 1){
			for (var i = pathFile.length - 1; i >= 0; i--) {
				force_download(pathFile[i]);
			}
		}
	}

	function force_download(path){
		$.fileDownload(BASE_URL + "index.php/home/download_file?path=" + path, { // bỏ dấu ./
		    successCallback: function (url) {
		        alert('You just got a file download dialog or ribbon for this URL :' + url);
		    },
		    failCallback: function (html, url) {
		        alert('Your file download just failed for this URL:' + url + '\r\n' +
		                'Here was the resulting error HTML: \r\n' + html
		                );
		    }
		});
	}

	/* dropzone */
	/* xoá rồi lưu, thêm nhưng k lưu */
	var pathFile = [];

	$scope.mockFiles = [];
	$scope.myDz = null;
	$scope.dzMethods = {};
	
	var i = 0;
	var date = new Date();
	var dateAdd = new Date();
	$scope.txt_time = moment().format('DD/MM/YYYY hh:mm A');

	/* dropzone */
	$scope.dzOptions = {
		url: BASE_URL + "index.php/home/upload",
		 sending: function(file, xhr, formData){
			var store = $scope.selected_store;
            var city = $scope.selected_city;
			var time = $scope.txt_time;

			if(i==0){
				i++;
				dateAdd = moment(dateAdd).subtract(1, 'minutes');
	  			formData.append('time', moment(dateAdd).format('DD/MM/YYYY hh:mm A'));
			}
			else {
				// random so
				var rdom = Math.floor((Math.random()*5)+1); console.log(rdom);
				var timerd = moment(date).subtract(rdom, 'minutes');
		  		formData.append('time', moment(timerd).format('DD/MM/YYYY hh:mm A'));

				// formData.append('time', time);
			}
	        
	        formData.append('store', store);
	        formData.append('city', city);
	    },
		paramName: 'imgage_file',
		renameFilename: function (filename) {
			return 'img_uploaded_' + new Date().getTime() + filename.substring(filename.lastIndexOf('.'), filename.length);
		},
		/*maxFilesize: '30',*/
		maxFiles: Number.MAX_SAFE_INTEGER.toString(), // '6', // cho max luôn, khi lưu bắt độ dài arr
		success: function (file, response) {
			var fileName = JSON.parse(response).fileName;
			$timeout(function () {
				file.flink = fileName;
				pathFile.push(fileName);
			});
		},
		
	};

	var bindMockFile = function () {
		$timeout(function () {
			$scope.myDz = $scope.dzMethods.getDropzone();
			$scope.mockFiles.forEach(function (mockFile) {
				$scope.myDz.emit('addedfile', mockFile);
				$scope.myDz.emit('complete', mockFile);
				$scope.myDz.options.maxFiles = $scope.myDz.options.maxFiles - 1;
				$scope.myDz.files.push(mockFile);
			});
		});
	};
	bindMockFile();

	$scope.dzCallbacks = {
		'addedfile': function (file) {
			if (file.isMock) {
				$scope.myDz.createThumbnailFromUrl(file, file.serverImgUrl, null, true);
			}
			file.previewElement.addEventListener("click", function () {
				var win = window.open(BASE_URL + file.flink, '_blank');
				win.focus();
			});
		},
		'removedfile': function (file) {
			pathFile.removeByValue(file.flink, 1);
			DeleteFile(file.flink);
		}
	};
	
	function DeleteFile(patchList) {
		var _url = BASE_URL + "index.php/home/remove";
		var _dataSend = {
			patch: patchList
		};

		$("#divLoading").show();
		$http.post(_url, _dataSend).then(function (response) {
			if (!response) {
				toastr.error("Không nhận được phản hồi từ máy chủ (js).");
			}
		});
		$("#divLoading").hide();
	}
}]);
