const script = document.createElement('script')
script.innerHTML = `
const observer = new MutationObserver((records) => {
  const iframe = document.getElementById('tdialog-simple-iframe')

  if (!iframe) return
  iframe.style.height = '520px'

  const trigger = () => {
    const statusWrap = iframe.contentWindow.document.querySelector('.status-wrap')

    if (!statusWrap) return

    const capsuleWrap = statusWrap.querySelectorAll('.capsule-wrap')[1]
    const statusKeySet = new Set(Object.keys(statusMap))

    statusWrap.querySelectorAll('.checkable-capsule-item').forEach((el) => {
      statusKeySet.delete(el.dataset.value)
    })

    statusWrap.appendChild(document.createElement('hr'))

    statusKeySet.forEach((value) => {
      const node = capsuleWrap.cloneNode(true)
      const capsuleItem = node.querySelector('.checkable-capsule-item')
      capsuleItem.id = value
      capsuleItem.dataset.to = value
      capsuleItem.dataset.value = value
      node.querySelector('.checkable-capsule-item span').innerText = statusMap[value]
      statusWrap.appendChild(node)
    })

    with (iframe.contentWindow) {
      $(".div-status .checkable-capsule-item").off('click')
      listenStatusSelectors()
      const appendFieldsWrap = document.getElementById('append_fields')
      Array.from(appendFieldsWrap.querySelectorAll('.workflow-div.clearfix')).slice(1).forEach((e) => e.remove())
      const fn = window.statusChange
      window.statusChange = function statusChange (e, t, a) {
        const wf = appendFieldsWrap.querySelector('.workflow-div.clearfix')

        if (!wf) return console.log('no workflow-div')
        wf.id = 'table-' + e + '-' + t
        const nameString = 'data[STATUS_' + e + '-' + t + '][owner]'
        wf.querySelector('.tfl-avatar-list').dataset.avatarHiddenname = nameString
        wf.querySelector('input[type=hidden]').name = nameString
        fn.apply(this, arguments)
      }
    }
  }

  iframe.addEventListener('load', trigger)
})

observer.observe(document.body, { childList: true })

const statusMap = {
  "planning": "规划中",
  "developing": "开发中",
  "testing": "测试中",
  "resolved": "已上线",
  "rejected": "已拒绝",
  "status_1": "已留档",
  "status_2": "待开发",
  "status_3": "待测试",
  "status_4": "待上线",
}
`
document.body.appendChild(script)
