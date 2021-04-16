export class Tabs {
  constructor(id) {
    // easy-tab实例
    this.tab = null
    //容器id
    this.id = id
    //是否有菜单
    this.hasContextmenu = false
    //当前右键选中的tab，不是高亮的tab！！
    this.currTab = null
    //保存关闭前事件
    this.beforeColseFn = null
  }


  /**
   * 通过id初始化tab
   * @param id
   */
  init(ref) {
    //获取容器宽高
    const dom = ref[0].$el
    const width = dom.clientWidth - 40,
      height = dom.clientHeight - 10,
      _self=this
    this.tab = $("#" + this.id).tabs({
      plain: true,
      width: width,
      height: height,
      fit: true,
      onContextMenu: (e,title) => {
        if (!_self.hasContextmenu) {
          document.oncontextmenu = () => false;
          const html = `<ul class="tab-contextmenu">
            <li>关闭当前</li>
            <li>关闭其他</li>
            <li>关闭全部</li>
            <li>取消</li>
           </ul>
            <div class="contextmenu-mask"></div>`
          $('body').append(html)
          //动态修改偏移位置
          $('.tab-contextmenu').css({
            top: e.clientY,
            left: e.clientX
          })
          this.hasContextmenu = true
          _self.currTab=_self.tab.tabs('getTab', title)
          //多次注册，防止tab实例被篡改
          $('.tab-contextmenu li').off('click')
          $('.tab-contextmenu li').on('click', function () {
            const name=$(this).text()
            switch (name) {
            case '关闭当前':
              //获取当前高亮的tab
              _self.close(null, _self.tab.tabs('getTabIndex', _self.currTab))
              _self.resetContextmenu()
              break
            case '关闭其他':
              //获取全部tab
              // eslint-disable-next-line no-case-declarations
              const tablist = _self.tab.tabs('tabs'), currIndex = _self.tab.tabs('getTabIndex', _self.currTab)
              for (let i = tablist.length; i >= 0; i--) {
                //如果是当前的tab，就跳过，关闭其他的tab
                if (i !== currIndex) {
                  _self.tab.tabs('close', i)
                }
              }
              _self.resetContextmenu()
              break
            case '关闭全部':
              //获取全部tab
              // eslint-disable-next-line no-case-declarations
              const tabs = _self.tab.tabs('tabs')
              for (let i = tabs.length; i >= 0; i--) {
                _self.tab.tabs('close', i)
              }
              _self.resetContextmenu()
              break
            case '取消':
              _self.resetContextmenu()
              break
            default :
              '关闭当前'
            }
          })
          //点击body，关闭右键弹窗
          $(document).off('click')
          $(document).on('click',function () {
            _self.resetContextmenu()
          })
        }
      },
      onBeforeClose:()=>{
        //关闭右键弹窗
        this.resetContextmenu()
        if(_self.beforeColseFn){
          //执行关闭事件
          return _self.beforeColseFn()
        }
      }
    })
  }

  /**
   * 打开一个标签页
   */
  add(item) {
    //先看tab队列里面有没有tab。没有才添加，有跳转到该tab
    const res = this.getTabById(item.moduleId)
    if (!res.inTabs) {
      // 添加一个新的标签页面板（tab panel）
      this.tab.tabs('add', {
        title: item.name,
        content: `<iframe src=${item.pageUrl} 
id=${item.moduleId}
style="width: 100%;height: 100%;border: none;display: block"></iframe>`,
        closable: true,
        options: {
          id: item.moduleId
        }
      });
    } else {
      this.show(res.index)
    }
  }

  /**
   * 获得当前显示标签页对象，如果为null，则表示没有当前显示页
   */
  getCur() {
    return this.tab.tabs('getSelected')
  }

  /**
   * 更新指定tab的标题
   */
  setName(id, title) {
    const tab = this.getTabById(id).tab
    this.tab.tabs('update', {
      tab: tab,
      options: {
        title: title
      }
    });
  }

  /**
   * 更新指定tab的pageUrl
   * @param {*} id 
   * @param {*} pageUrl 
   */
  addOrUpdate(item){
    const res = this.getTabById(item.moduleId)
    if (!res.inTabs) {
      // 添加一个新的标签页面板（tab panel）
      this.tab.tabs('add', {
        title: item.name,
        content: `<iframe src=${item.pageUrl} 
id=${item.moduleId}
style="width: 100%;height: 100%;border: none;display: block"></iframe>`,
        closable: true,
        options: {
          id: item.moduleId
        }
      });
    } else {
      const tab = res.tab
      this.tab.tabs('update', {
        tab: tab,
        options: {
          title: item.name,
          content: `<iframe src=${item.pageUrl} 
id=${item.moduleId}
style="width: 100%;height: 100%;border: none;display: block"></iframe>` 
        }             
      });
      //并选中这个tab
      this.show(res.index)
    }
  }

  /**
   * 关闭指定标签页
   */
  close(id,index) {
    //如果有索引值，直接通过索引值关闭
    if(index||index===0){
      this.tab.tabs('close', index)
    }else{
      const res = this.getTabById(id)
      if (!res.inTabs) {
        console.error('id出错');
        return false
      }
      this.tab.tabs('close', res.index)
    }
  }

  /**
   * 关闭当前高亮tab
   */
  closeCurr(){
    const tab = this.tab.tabs('getSelected');
    const index = this.tab.tabs('getTabIndex',tab);
    this.tab.tabs('close', index)
  }

  /**
   * 设置关闭前事件
   * @param fn  函数，如果需要阻止关闭，则需要返回false
   */
  beforeClose(fn){
    this.beforeColseFn=fn
  }

  /**
   * 切换显示指定标签页
   */
  show(index) {
    this.tab.tabs('select', index)
  }

  /**
   * 查找当前模块的标签页对象
   */
  find(id) {
    return this.getTabById(id).tab
  }

  /**
   * 通过id获取tab相关状态，tab实例、索引、是否存在intabs
   * @param id
   * @returns {{inTabs: boolean, tab: null, index: number}}
   */
  getTabById(id) {
    const tabs = this.tab.tabs('tabs')
    let inTabs = false, tab = null, index = 0
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i][0].firstChild.id === id) {
        tab = tabs[i]
        index = i
        inTabs = true
      }
    }
    return {
      tab: tab,
      inTabs: inTabs,
      index: index
    }
  }

  //重置tab右键信息
  resetContextmenu(){
    $('.tab-contextmenu').remove()
    $('.contextmenu-mask').remove()
    this.hasContextmenu = false
    this.currTab=null
  }
}