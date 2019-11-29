import store from '../store/index';

export function loadGridHeight (tabName) {
  var height = document.documentElement.clientHeight;
  // 查询条件 tab为标签页的ID
  if (tabName) {
    height -= 70;
    height -= $("#"+tabName+" .fieldset").actual('height');
  } else {
    if($(".fieldset").length>0)
    height -= $(".fieldset").height();
  }
  // 表格工具栏
  if ($(".head-box").length>0)
    height -= $(".head-box").height();
  // 表格分页栏
  if ($(".pagination-container").length>0)
    height -= $(".pagination-container").height();
  // padding
  height -= 50;
  // header加上页面标签栏的高度
  height -= 100;
  //console.log(height);
  return height;
}

export function loadDashboardHeight () {
  var height = store.getters.screenHeight;
  if (height === undefined)
    return 'dashboard';
  switch(height){
    case 768:
      return 'dashboard768';
      break;
    case 1080:
      return 'dashboard1080';
      break;
    default:
      return 'dashboard';
  }
}

export function loadMapHeight (fullScreen) {
  var height = store.getters.screenHeight;
  if (height === undefined)
    return fullScreen ? 'mapAreaFull' : 'mapArea';
  switch(height){
    case 768:
      return fullScreen ? 'mapAreaFull768' : 'mapArea768';
      break;
    case 1080:
      return fullScreen ? 'mapAreaFull1080' : 'mapArea1080';
      break;
    default:
      return fullScreen ? 'mapAreaFull' : 'mapArea';
  }
}

export function loadHouseRightTreeHeight(fullScreen) {
  var height = store.getters.screenHeight;
  if (height === undefined)
    return fullScreen?768*0.69: '59vh';
  switch(height){
    case 768:
      return fullScreen?768*0.69: '59vh';
      break;
    case 1080:
      return fullScreen?1080*0.76:'69vh';
      break;
    default:
      return  fullScreen?768*0.69: '59vh';
  }
}
