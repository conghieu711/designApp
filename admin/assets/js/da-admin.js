!(function($){
	"use strict";

	  ////////////
	 // HELPER //
	////////////
	String.prototype.format = function() {
		var args;
		args = arguments;
		if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') {
			args = args[0];
		}
		return this.replace(/{([^}]*)}/g, function(match, key) {
			return (typeof args[key] !== "undefined" ? args[key] : match);
		});
	};
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
			$tb_body_tabs = $tb_backend_design_app.find('.tb-body-tabs');

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
			$li.find('a').trigger('click');
		})

		$tb_header_tabs.on('click', '.tb-tab-nav a', function(e){
			e.preventDefault();
			e.stopPropagation();

			var $this = $(this),
				tab_name = $this.data('tab-name');

			$this.parent('li').addClass('tb-current-tab').siblings().removeClass('tb-current-tab');	
			$tb_body_tabs.find('.body-tab[data-tab-name="{0}"]'.format(tab_name))
			.addClass('tb-current-tab').siblings().removeClass('tb-current-tab');
		})


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

			var $frameItem = $('<div>', {id: 'f-{0}'.format(randID), class: 'tb-frame-item', html: '<img src="{0}"/>'.format(fileString)});
			tBframes.append($frameItem);

			var $listItem = $('<li>', {id: 'l-{0}'.format(randID), class: 'tb-frame-list-item', html: '<span><i class="ion-android-more-vertical"></i></span> {0}'.format(fileName)});
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
				sub_id = $this.attr('id').split('-')[1],
				$f_elem = $tb_backend_design_app.find('#f-{0}'.format(sub_id)),
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
			var html_resull = loadTemplate('assets/js/js-template/tool-box.html', data);
			console.log(html_resull);
		})

		  ///////////////////
		 // LAOD TEMPLATE //
		///////////////////
		var cache_temp = [];
		var loadTemplate = function(tempURL, data){
			var templateHTML = "";

			if(cache_temp[tempURL]){
				templateHTML = cache_temp[tempURL];
			}else{
				$.ajax({ async: false, url: tempURL, success: function(temp){ templateHTML = temp; } })
				cache_temp[tempURL] = templateHTML;
			}

			return templateHTML.format(data);
		}
	})
})(jQuery)