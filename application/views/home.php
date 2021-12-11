<!DOCTYPE html>
<html lang="en">
<head>
	<base href="<?=base_url()?>">

	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Upload Images</title>

	<link rel="stylesheet" href="<?php echo base_url()?>public/vendors/bootstrap.min.css">
	<link rel="stylesheet" href="<?php echo base_url()?>public/vendors/dropzone/dropzone.css">
	<link rel="stylesheet" href="<?php echo base_url()?>public/vendors/dropzone/ng-dropzone.css">
	
	<style type="text/css" media="screen">
		.container {
		    margin-top: 20px;
		}
		.dropzone .dz-preview .dz-image {
		    width: 145px;
		    height: 145px;
		}
	</style>

	<script type="text/javascript">
		const BASE_URL = '<?= base_url() ?>';
	</script>
</head>
<body ng-app="myApp" ng-controller="MainCtrl">
	
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="form-group">
					<h6>TIME</h6>
					<input type="text" class="form-control" ng-model="txt_time" ng-change="time_change()">
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="form-group">
					<h6>CITY</h6>
					<select ng-change="updateCity()" ng-model="selected_city" name="selected_city" id="selected_city" class="form-control" required="required">
						<option value=""></option>
						<option ng-repeat="x in citys" value="{{x}}">{{$index+1}}. {{x}}</option>
					</select>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="form-group">
					<h6>STORE</h6>
					<select ng-model="selected_store" name="selected_store" id="selected_store" class="form-control" required="required">
						<option value=""></option>
						<option ng-repeat="x in stores" value="{{x}}">{{$index+1}}. {{x}}</option>
					</select>
				</div>
			</div>
		</div>
		<div class="row" ng-show="selected_store != null && selected_city != null">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="form-group">
					<h6>IMAGE</h6>
					<div class="dropzone col" options="dzOptions" callbacks="dzCallbacks" methods="dzMethods" ng-dropzone></div>
				</div>
			</div>
			<div class="col-12">
				<input type="button" class="btn btn-danger" value="Xoá Hết" ng-click="delete_all()">
				<input type="button" class="btn btn-success" value="Tải hết" ng-click="download_all()">
			</div>
		</div>
	</div>
	
	<script src="<?php echo base_url()?>public/vendors/jquery.min.js"></script>
	<script src="<?php echo base_url()?>public/vendors/jquery-file-download.js"></script>
	<script src="<?php echo base_url()?>public/vendors/moment.min.js"></script>
	<script src="<?php echo base_url()?>public/vendors/angular.min.js"></script>
	<script src="<?php echo base_url()?>public/vendors/angular-sanitize.js"></script>
	<script src="<?php echo base_url()?>public/vendors/dropzone/dropzone.js"></script>
	<script src="<?php echo base_url()?>public/vendors/dropzone/ng-dropzone.js"></script>

	<script src="<?php echo base_url() . 'public/js/app.js?v='.date('y.m.d.his')?>"></script>
</body>
</html>