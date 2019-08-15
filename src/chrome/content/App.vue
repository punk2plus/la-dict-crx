<template>
    <div class="ll-dict-ce">
        <DictPanel v-if="queryWord && queryResult" :queryResult="queryResult" :queryWord="queryWord" />
    </div>
</template>

<script>
import DictPanel from '../../components/DictPanel'

export default {
    name: 'app',
    components: {
        DictPanel
    },
    data() {
        return {
            showTable: false,
            timer: null,
            queryResult: null,
            queryWord: ''
        }
    },
    created() {
        document.documentElement.addEventListener('mouseup', event => {
            if (event.type === 'selectstart') return
            // 获取选中内容
            const selection = window.getSelection && window.getSelection()
            // 过来为空的情况
            if (!selection && selection.rangeCount === 0) return
            const selectText = selection.toString().trim()
            if (!selectText) return

            if (this.timer) {
                return
            }

            console.log('======>>>>', selectText)

            this.timer = setTimeout(() => {
                window.chrome.runtime.sendMessage(
                    {
                        type: 'selectText',
                        result: {
                            queryWord: selectText
                        }
                    },
                    data => {
                        this.queryResult = data
                        this.queryWord = selectText

                        clearTimeout(this.timer)
                        this.timer = null
                    }
                )
            }, 50)
        })
    },
    methods: {
        toggleTable(status) {
            console.log(status)
            this.$message('zhegshisdfsdh')
            // this.showTable = status
        },
        handleSubmit() {
            this.$msgbox.alert('这是一段内容', '标题名称', {
                confirmButtonText: '确定',
                callback: action => {
                    this.showTable = false
                    this.$message({
                        type: 'info',
                        message: `action: ${action}`
                    })
                }
            })
        }
    }
}
</script>
