!(function($){
	"use strict";

	  ////////////
	 // HELPER //
	////////////
	String.prototype.format = function() {
		var args; args = arguments;
		if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') { args = args[0]; }
		return this.replace(/{([^}]*)}/g, function(match, key){
			var isFunc = key.match(/^@(\w+)/),
				key = (isFunc)? isFunc[1] : key,
				data = (typeof args[key] !== "undefined" ? args[key] : match);
			if(isFunc){
				var	fn = window[key];
				return (typeof fn === "function")? fn(data) : "{func '"+key+"' not define!}";
			}
			return data;
		})
	}
	var animate_fadeIn = function(elem, time){
		elem.fadeOut(0, function(){
			(time)? time : 600;
			$(this).fadeIn(time);
		})
	}
	var animate_rightToLeft = function(elem){
		elem.addClass('animate_right_to_left').delay(400).queue(function(){
			$(this).dequeue().removeClass('animate_right_to_left');
		})
	}

	  ////////////////////
	 // DOCUMENT READY //
	////////////////////
	$(function(){
		var $tb_backend_design_app = $('#tb_backend_design_app'),
			$tb_header_tabs = $tb_backend_design_app.find('.tb-header-tabs ul').first(),
			$tb_body_tabs = $tb_backend_design_app.find('.tb-body-tabs'),
			$tb_layout_config_main = $tb_backend_design_app.find('.tb-layout-config-main'),
			_tabID;

		  /////////////////////////////
		 // SET DATA LAYOUT DEFAULT //
		/////////////////////////////
		var _dD = {
			framename: '',
			status: 'published',
		};

		  /////////////////
		 // UPDATE DATA //
		/////////////////
		var updateData = function(updateData){
			var $data_tag = $tb_header_tabs.find('a[data-tab-name="{0}"]'.format(_tabID)),
				data_save = $data_tag.data('layout-save');

			$data_tag.data('layout-save', $.extend({}, data_save, updateData));
		}

		  ///////////////////
		 // LAOD TEMPLATE //
		///////////////////
		var cache_temp = [];
		var loadTemplate = function(tempURL, data){
			var templateHTML = "";

			if(cache_temp[tempURL]){
				templateHTML = cache_temp[tempURL];
			}else{
				$.ajax({ async: false, url: tempURL, data: data,success: function(temp){ templateHTML = temp; } })
				cache_temp[tempURL] = templateHTML;
			}

			return templateHTML.format(data);
		}

		  /////////////////////
		 // OPEN FRAME INFO //
		/////////////////////
		var openFrameInfo = function(){
			var $this = $(this),
				dataLayout = $this.data('layout-save'),
				data = {
					tabID: _tabID,
					framename: $this.html(),
					status: dataLayout.status,
				};

			var result_html = loadTemplate('{0}frame-info.php'.format(JS_TEMP), data);
			$tb_layout_config_main.html(result_html);
		}

		  /////////////////////////////
		 // ADD MORE AND SELECT TAB //
		/////////////////////////////
		var tab_content_html_default = $tb_body_tabs.find('.tb-current-tab').html();
		$tb_backend_design_app.on('click', '#add-more-frame', function(e){
			e.preventDefault();
			e.stopPropagation();

			var randID = Math.random().toString(36).substr(2, 12),
				$li = $('<li>', { class: 'tb-tab-nav', html: '<a href="#" data-tab-name="{0}">New Frame</a>'.format(randID) }),
				$content = $('<div>', { class: 'body-tab', html: tab_content_html_default }).attr('data-tab-name', randID);

			$tb_header_tabs.append($li);
			$tb_body_tabs.append($content);

			// active new tab
			$li.find('a').data('layout-save', _dD).trigger('click');
		})

		$tb_header_tabs.on('click', '.tb-tab-nav a', function(e){
			e.preventDefault();
			e.stopPropagation();

			var $this = $(this),
				tab_name = $this.data('tab-name');
			
			// set _tabID
			_tabID = tab_name;
			// open frame info
			openFrameInfo.call(this);
			// update data layout
			updateData({framename: $this.html()});console.dir($this.data('layout-save'));

			$this.parent('li').addClass('tb-current-tab').siblings().removeClass('tb-current-tab');	
			$tb_body_tabs.find('.body-tab[data-tab-name="{0}"]'.format(tab_name))
			.addClass('tb-current-tab').siblings().removeClass('tb-current-tab');
		}).find('li:first a').data('layout-save', _dD).trigger('click');

		  //////////////////
		 // UPLOAD FRAME //
		//////////////////
		var $field_upload_frame = $('#field_upload_frame');
		function fileUploadHandle(opts){
			$field_upload_frame.unbind('change').bind('change', function(e){
				opts.callback.call(this);
			})
		} 

		$tb_backend_design_app.on('click', '.tb-area-upload-frame', function(e){
			var $this = $(this),
				$frameControl = $this.next('.tb-frame-control-ui');

			fileUploadHandle({
				callback: function(){
					$this.addClass('upload-small-ui');
					var files = this.files;
					
					$.each(files, function(){
						var file = this,
							reader = new FileReader();
						reader.onload = function(e){
							var fileString = e.target.result;
							$frameControl.trigger('frameUI', {fileString: fileString, fileName: file.name});
						}
						reader.readAsDataURL(file);
					})
				}
			})
		})	

		  //////////////
		 // FRAME UI //
		//////////////
		$tb_backend_design_app.on('frameUI', '.tb-frame-control-ui', function(e, opts){
			var $this = $(this),
				fileString = opts.fileString,
				fileName = opts.fileName,
				tBFrameList = $this.find('.tb-frames-list-layout'),
				tBframes = $this.find('.tb-frames-main'),
				randID = Math.random().toString(36).substr(2, 12);

			var $frameItem = $('<div>', {id: '{0}-f-{1}'.format(_tabID, randID), class: 'tb-frame-item', html: '<img src="{0}"/>'.format(fileString)});
			tBframes.append($frameItem);

			var $listItem = $('<li>', {id: '{0}-l-{1}'.format(_tabID, randID), class: 'tb-frame-list-item', html: '<span><i class="ion-android-more-vertical"></i></span> {0}'.format(fileName)});
			tBFrameList.prepend($listItem);

			// animate $listitem
			animate_fadeIn($listItem);

			// use jQuery ui sortable
			var params = {
				axis: "y",
				cursor: "move",
				handle: "span",
				start: function( event, ui ) { this._index = ui.item.index(); },
				stop: oderLayout,
			};
			(!tBFrameList.hasClass('ui-sortable'))? tBFrameList.sortable(params) : ""; 
		})

		  /////////////////
		 // ODER LAYOUT //
		/////////////////
		var oderLayout = function(event, ui){
			var $this = ui.item,
				l_length = $this.siblings().length,
				sub_id = $this.attr('id').split('-').pop(),
				$f_elem = $tb_backend_design_app.find('#{0}-f-{1}'.format(_tabID, sub_id)),
				$f_elem_parent = $f_elem.parent(),
				index = $this.index(),
				new_order = l_length - index;
			if (new_order == 0) { $f_elem_parent.prepend($f_elem); }
			else if (new_order == l_length) { $f_elem_parent.append($f_elem); }
			else { 
				if (this._index < index) 
					$f_elem_parent.find('.tb-frame-item').eq(new_order - 1).after($f_elem); 
			 	else 
					$f_elem_parent.find('.tb-frame-item').eq(new_order).after($f_elem); 
			}			
		}

		  //////////////////
		 // OPEN TOOLBOX //
		//////////////////
		$tb_backend_design_app.on('click', '.tb-frame-list-item', function(e){
			var data = {
				name: 'Hieu',
				old: '24',
				team: 'Bears',
			};
			var html_resull = loadTemplate('{0}layout-item-config.html'.format(JS_TEMP), data);
			console.log(html_resull);
		})
	})
})(jQuery)