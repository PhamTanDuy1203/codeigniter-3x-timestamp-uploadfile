<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library('image_lib');
	}

	public function index()
	{
		$this->load->view('home.php');
	}

	public function get_list_file(){
		$this->load->helper('directory');
		$map = directory_map('./public/uploads/');
		echo json_encode($map);
	}

	public function upload()
	{
		try {
			if (!empty($_FILES['imgage_file']['name'])) {

			 	$time = $this->input->post('time');
				$store = $this->input->post('store');
				$city = $this->input->post('city');
				$file_size  = $_FILES['imgage_file']['size']; // MB

				$file = $_FILES["imgage_file"]['tmp_name'];
				list($width, $height) = getimagesize($file);

				$config['upload_path'] = './public/uploads/';
				$config['allowed_types'] = 'gif|jpg|png|jpeg';
				$config['max_size']  = '31457280'; // 30MB
				$config['max_width']  = '10000';//700
				$config['max_height']  = '10000';//850
				$config['file_name']  = $_FILES['imgage_file']['name'];

				$this->load->library('upload', $config);

				if ( ! $this->upload->do_upload("imgage_file")){
					$error = array('error' => $this->upload->display_errors());
					echo json_encode(array('status' => false, 'massage' => $error));
				}
				else{
					$data = array('upload_data' => $this->upload->data());

                    // add text dòng 1
                    
                    // x > y bị xoay -> không xoay nó

					if($width > $height) // 2MB
					{
						$this->rotate($config['upload_path'].$config['file_name']);
						$this->rotate($config['upload_path'].$config['file_name']);
						$this->rotate($config['upload_path'].$config['file_name']);
					}

                    $this->resize($config['upload_path'] . $config['file_name']);

					$this->add_text($config['upload_path'].$config['file_name'], $time, '25');
					$this->add_text($config['upload_path'].$config['file_name'], $city, '130');
					$this->add_text($config['upload_path'].$config['file_name'], $store, '235');

					echo json_encode(array('status' => true, 'fileName' => $config['upload_path'].$config['file_name']));
				}
			}
			else {
				echo json_encode(array('status' => false, 'massage' => 'Không có file để tải lên.'));
			}
		} catch (Exception $e) {
			$err = $e;
		}
	}

	function rotate($src_patch='')
	{
        $configw = array();
		$configw['source_image'] = $src_patch;
		$configw['rotation_angle'] = 90;
		$this->image_lib->initialize($configw);
		$this->image_lib->rotate();
    }
    
    function resize($src_patch){
        $configw = array();
        $configw['source_image'] = $src_patch;

        // config resize
        $configw['width']        = 1440;
        $configw['height']       = 2560;

        $this->image_lib->initialize($configw);
        $this->image_lib->resize();
    }

	function add_text($src_patch='', $text='', $vrt='')
	{
        $configw = array();
		$configw['source_image'] = $src_patch;

		// config watermark
		$configw['wm_text'] = $text;
		$configw['wm_type'] = 'text';
		$configw['wm_font_path'] = './public/fonts/Roboto-Regular.ttf';
		$configw['wm_font_size'] = '60';
		$configw['wm_font_color'] = 'ffffff';
		$configw['wm_vrt_alignment'] = 'top';
		$configw['wm_hor_alignment'] = 'right';
		$configw['wm_hor_offset'] = '-15';
		$configw['wm_vrt_offset'] = $vrt;
		$configw['wm_padding'] = '0';
		$configw['wm_shadow_color'] = '848484';
		$configw['wm_shadow_distance'] = '4';

		$this->image_lib->initialize($configw);
		$this->image_lib->watermark();
	}

    public function remove()
    {
        try {
            $this->load->helper("file");
            $data = (array) json_decode(file_get_contents("php://input"));

            unlink($data['patch']);

            echo json_encode(true);
        } catch (Exception $e) {
            $err = $e;
        }
    }

	public function remove_list()
	{
		try {
            $this->load->helper("file");
            $data = (array) json_decode(file_get_contents("php://input"));

            foreach ($data['patchList'] as $patch){
                unlink($patch);
            }
            echo json_encode(true);
        } catch (Exception $e) {
            $err = $e;
        }
	}

	public function download_file()
	{
		try {
			$this->load->helper('download');
            $path = $this->input->get('path', TRUE);
            force_download($path, NULL);
        } catch (Exception $e) {
            $err = $e;
        }
	}
}

/* End of file Home.php */
/* Location: ./application/controllers/Home.php */
