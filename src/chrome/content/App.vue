<template>
    <div class="ll-dict-ce">
        <DictPanel />
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
            showTable: false
        }
    },
    methods: {
        toggleTable(status) {
            console.log(status)
            // this.$message('zhegshisdfsdh')
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
