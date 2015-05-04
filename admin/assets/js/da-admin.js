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
		var daAdmin = {
			init: function(){
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
					console.log($data_tag.data('layout-save'));
				}

				  ///////////////////
				 // LAOD TEMPLATE //
				///////////////////
				var cache_temp = [];
				var loadTemplate = function(tempURL, data, cache){
					var templateHTML = "",
						cache = (cache === true)? true : false;
						
					if(cache_temp[tempURL]){
						templateHTML = cache_temp[tempURL];
					}else{
						$.ajax({ 
							type: 'POST', 
							async: false, 
							url: tempURL, 
							data: data,
							success: function(temp){ 
								templateHTML = temp; 
							} 
						})

						if(cache == true){ cache_temp[tempURL] = templateHTML };
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

				  /////////////////////////////////
				 // CONROLLER FIELDS FRAME INFO //
				/////////////////////////////////

				// update frame name field
				$tb_backend_design_app.on('input', '.frame-info-js input.tb-framename-js', function(){
					var value = $(this).val();

					updateData({framename: value});
					$tb_header_tabs.find('a[data-tab-name="{0}"]'.format(_tabID)).html(value);
				})
				// update status
				$tb_backend_design_app.on('change', '.frame-info-js select.tb-status-js', function(){
					var value = $(this).val(),
						$tab_header_el = $tb_header_tabs.find('a[data-tab-name="{0}"]'.format(_tabID));
					(value == "pending")? $tab_header_el.addClass('pending') : $tab_header_el.removeClass('pending');
					updateData({status: value});
				})
				// delete frame btn
				$tb_backend_design_app.on('click', '.frame-info-js button.delete-frame-js', function(){
					swal({
					  	title: "Are you sure?",
					  	text: "You will not be able to recover this frame!",
					  	type: "warning",
					  	showCancelButton: true,
					  	confirmButtonColor: "#DD6B55",
					  	confirmButtonText: "Yes, delete it!",
					  	closeOnConfirm: false
					},
					function(){
						$tb_header_tabs.find('a[data-tab-name="{0}"]'.format(_tabID)).parent('li').remove();
						$tb_body_tabs.find('.body-tab[data-tab-name="{0}"]'.format(_tabID)).remove();
						$tb_layout_config_main.find('.tb-layout-config-item[data-tabid="{0}"]'.format(_tabID)).remove();
					  	swal("Deleted!", "This frame has been deleted.", "success");
					});
				})

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
					updateData({framename: $this.html()});

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

				  ////////////////////
				 // SET DATA FRAME //
				////////////////////
				$.fn.reverse = [].reverse;
				var setDataFrame = function(){
					var $body_tab_current = $('.body-tab[data-tab-name="{0}"]'.format(_tabID)),
						$tb_frames_main = $body_tab_current.find('.tb-frames-main'),
						frameData = [];

					$tb_frames_main.find('.tb-frame-item').reverse().each(function(){
						var $this = $(this),
							$img_inner = $this.find('img');

						frameData.push({name: $img_inner.data('frame-name'),src: $img_inner.attr('src'), status: $img_inner.data('status')});
					})

					updateData({frames: frameData});
				}

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

					var $frameItem = $('<div>', {id: '{0}-f-{1}'.format(_tabID, randID), class: 'tb-frame-item', html: '<img src="{0}" data-frame-name="{1}" data-status="{2}"/>'.format(fileString, fileName, 'published')});
					tBframes.append($frameItem);

					var $listItem = $('<li>', {id: '{0}-l-{1}'.format(_tabID, randID), class: 'tb-frame-list-item', html: '<span class="layout-move" title="order"><i class="ion-android-more-vertical"></i></span> <span class="layout-remove" title="remove"><i class="ion-android-cancel"></i></span> <span class="layout-display" title="display"><i class="ion-eye-disabled"></i></span> <span class="layout-name">{0}</span>'.format(fileName)});
					tBFrameList.prepend($listItem);

					// animate $listitem
					animate_fadeIn($listItem);

					// set data frame
					setDataFrame();

					// syn handle
					synHandleLayout($listItem, $frameItem);

					// use jQuery ui sortable
					var params = {
						axis: "y",
						cursor: "move",
						handle: "span.layout-move",
						start: function( event, ui ) { this._index = ui.item.index(); },
						stop: oderLayout,
					};
					(!tBFrameList.hasClass('ui-sortable'))? tBFrameList.sortable(params) : ""; 
				})

				// syn handle layout
				var synHandleLayout = function(listItemEl, frameItemEl){
					// name
					listItemEl.find('span.layout-name').on('updateName', function(){
						var name = $(this).text();
						frameItemEl.find('img').data('frame-name', name);
					})

					// delete
					listItemEl.find('span.layout-remove').on('click', function(e){
						e.preventDefault();
						e.stopPropagation();

						swal({
						  	title: "Are you sure?",
						  	text: "You will not be able to recover this layout!",
						  	type: "warning",
						  	showCancelButton: true,
						  	confirmButtonColor: "#DD6B55",
						  	confirmButtonText: "Yes, delete it!",
						  	closeOnConfirm: false
						},
						function(){
							listItemEl.remove();
							frameItemEl.remove();
							setDataFrame();
						  	swal("Deleted!", "This layout has been deleted.", "success");
						});
					})

					// display
					listItemEl.find('span.layout-display').on('click', function(e){
						e.preventDefault();
						e.stopPropagation();

						var $i_icon = $(this).find('i'); // ion-eye-disabled | ion-eye
						if($i_icon.hasClass('ion-eye-disabled')){
							var class_icon = 'ion-eye', status = 'pending', opacity = 0;
							listItemEl.find('span.layout-name').css('textDecoration', 'line-through');
						}else{
							var class_icon = 'ion-eye-disabled', status = 'published', opacity = 1;
							listItemEl.find('span.layout-name').css('textDecoration', 'none');
						}

						frameItemEl.find('img').data('status', status).css('opacity', opacity);
						$i_icon.attr('class', class_icon);
						setDataFrame();
					})
				}

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

					// set data frame
					setDataFrame();		
				}

				  //////////////////
				 // OPEN TOOLBOX //
				//////////////////
				var _layoutINDEX;
				$tb_backend_design_app.on('click', '.tb-frame-list-item', function(e){
					_layoutINDEX = $(this).index();
					$(this).addClass('current').siblings().removeClass('current');

					var data_save = $tb_header_tabs.find('a[data-tab-name="{0}"]'.format(_tabID)).data('layout-save'),
						data_layout_current = data_save.frames[_layoutINDEX],
						data = {
							tabID: _tabID,
							layoutname: data_layout_current.name,
						},
						result_html = loadTemplate('{0}layout-item-config.html'.format(JS_TEMP), data, true);

					$tb_layout_config_main.html(result_html);
				})

				  //////////////////////////////////
				 // CONROLLER FIELDS LAYOUT INFO //
				//////////////////////////////////
				// update frame name field
				$tb_backend_design_app.on('input', '.frame-layout-js input.tb-layoutname-js', function(){
					var value = $(this).val();
					$tb_body_tabs.find('.body-tab[data-tab-name="{0}"]'.format(_tabID))
					.find('.tb-frame-list-item')
					.eq(_layoutINDEX).find('span.layout-name').html(value).trigger('updateName');

					setDataFrame();
				})
			}
		};
		daAdmin.init();

		
	})
})(jQuery)