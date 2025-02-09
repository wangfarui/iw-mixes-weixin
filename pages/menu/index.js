Page({
  data: {
    menuList: [{
        title: "餐饮服务",
        items: [{
            name: "食谱",
            url: "/pages/eat/recipe",
            icon: "/images/menu/eat-recipe.png"
          },
          {
            name: "点餐",
            url: "/pages/eat/order",
            icon: "/images/menu/eat-dishes.png"
          },
          {
            name: "用餐记录",
            url: "/pages/eat/record",
            icon: "/images/menu/eat-meal.png"
          }
        ]
      },
      {
        title: "记账服务",
        items: [{
            name: "记账",
            url: "/pages/bookkeeping/bookkeeping-action/index",
            icon: "/images/menu/bookkeeping-action.png"
          },
          {
            name: "记账记录",
            url: "/pages/bookkeeping/record",
            icon: "/images/menu/bookkeeping-records.png"
          },
          {
            name: "收支分析",
            url: "/pages/bookkeeping/analysis",
            icon: "/images/menu/bookkeeping-statistics.png"
          }
        ]
      },
      {
        title: "积分服务",
        items: [{
            name: "新增积分",
            url: "/pages/points/add",
            icon: "/images/menu/points-action.png"
          },
          {
            name: "积分记录",
            url: "/pages/points/record",
            icon: "/images/menu/points-records.png"
          },
          {
            name: "积分分析",
            url: "/pages/points/analysis",
            icon: "/images/menu/points-statistics.png"
          },
          {
            name: "积分任务",
            url: "/pages/points/task",
            icon: "/images/menu/points-task.png"
          }
        ]
      }
    ]
  },

  // 点击菜单项时，通过 wx.navigateTo 跳转到对应页面
  onMenuItemTap(e) {
    const url = e.currentTarget.dataset.url;
   console.log(url)
    wx.navigateTo({
      url: url
    });
  },

  onLoad() {
    console.log("菜单页面加载");
  }
});