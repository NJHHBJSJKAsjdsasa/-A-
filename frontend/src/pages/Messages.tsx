const Messages = () => {
  return (
    <div className="flex h-[600px]">
      <div className="w-1/3 border-r bg-gray-50 rounded-l-2xl">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">消息列表</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          <div className="p-4 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-doraemon-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">哆啦A梦官方</p>
                <p className="text-sm text-gray-500 truncate">欢迎来到哆啦A梦平台！</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white rounded-r-2xl">
        <div className="p-4 border-b">
          <h2 className="font-semibold">聊天窗口</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center text-gray-500">选择一个对话开始聊天</div>
        </div>
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input type="text" placeholder="输入消息..." className="input-field flex-1" />
            <button className="btn-primary">发送</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
