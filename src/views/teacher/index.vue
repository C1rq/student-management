<template>
  <div>
    <!-- 条件查询 -->
    <el-form
      :inline="true"
      :model="searchMap"
      ref="searchForm"
      style="margin-top: 20px"
    >
      <el-form-item prop="jobnumber">
        <el-input
          v-model="searchMap.jobnumber"
          placeholder="工号"
          v-if="!isDialog"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select
          v-model="searchMap.role"
          placeholder="教师职务"
          v-if="!isDialog"
        >
          <el-option
            v-for="option in roleOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="entrydate">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.entrydate"
          type="date"
          placeholder="入职时间"
          v-if="!isDialog"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button v-if="!isDialog" type="primary" @click="handleAdd"
          >新增</el-button
        >
        <el-button
          v-if="!isDialog"
          type="primary"
          @click="resetForm('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      :data="list"
      height="550"
      border
      style="width: 100%"
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
    >
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="jobnumber" label="工号"> </el-table-column>
      <el-table-column prop="name" label="教师姓名"> </el-table-column>
      <el-table-column v-if="!isDialog" prop="role" label="角色">
        <template slot-scope="scope">
          <span>{{ scope.row.role | roleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isDialog" prop="entrydate" label="入职时间">
      </el-table-column>
      <el-table-column prop="phone" label="电话"> </el-table-column>
      <el-table-column v-if="!isDialog" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.row._id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :layout="
        !isDialog
          ? 'total, sizes, prev, pager, next, jumper'
          : 'prev, pager, next'
      "
      :total="total"
    >
    </el-pagination>
    <!-- 新增弹窗 -->
    <el-dialog title="教师编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="teacher"
        ref="teacherForm"
        lable-width="100px"
        lable-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="工号" prop="jobnumber">
          <el-input v-model="teacher.jobnumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名" prop="name">
          <el-input v-model="teacher.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="teacher.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="jobnumber">
          <el-input v-model="teacher.jobnumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entrydate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="teacher.entrydate"
            type="date"
            placeholder="入职时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="职务" prop="role">
          <el-select v-model="teacher.role" placeholder="请点击选择">
            <el-option
              v-for="option in roleOptions"
              :key="option.type"
              :lable="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            teacher._id === null
              ? addData('teacherForm')
              : updateData('teacherForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from "@/api/teacher";
const roleOptions = [
  {
    type: "1",
    name: "班主任",
  },
  {
    type: "2",
    name: "教师",
  },
];
export default {
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        jobnumber: "",
        name: "",
        entrydate: "",
        role: "",
        phone: "",
      },
      teacher: {
        _id: null,
        jobnumber: "",
        name: "",
        entrydate: "",
        role: "",
        phone: "",
      },
      dialogFormVisible: false,
      roleOptions,
      rules: {
        jobnumber: [{ required: true, message: "请输入工号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
    };
  },
  props: {
    isDialog: false,
  },

  created() {
    this.fetchData();
  },

  components: {},
  filters: {
    roleFilter(type) {
      const obj = roleOptions.find((obj) => obj.type === type);
      return obj ? obj.name : null;
    },
  },

  methods: {
    clickCurrentChange(currentRow) {
      console.log(currentRow);
      this.$emit("option-teacher", currentRow);
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          teacherApi.update(this.teacher).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: resp.message,
                type: "success",
              });
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["teacherForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          teacherApi.add(this.teacher).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit");
        }
      });
    },
    searchData() {
      this.currentPage = 1;
      this.fetchData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handleSizeChange(val) {
      this.pageSize = val;
      console.log("handleSizeChange", val);
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log("handleCurrentChange", val);
      this.fetchData();
    },
    handleEdit(id) {
      this.handleAdd();

      teacherApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.teacher = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "warning",
          });
        }
      });
    },
    handleDelete(id) {
      console.log("删除");
      this.$confirm("确定删除该教师信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          teacherApi.deleteById(id).then((response) => {
            const resp = response.data;
            console.log(resp);
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message,
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          console.log(err);
        });
    },
    fetchData() {
      //   teacherApi.getList().then((response) => {
      //     const resp = response.data;
      //     console.log(resp);
      //     this.list = resp.data.rows;
      //   });
      teacherApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const resp = response.data;
          this.total = resp.data.total;
          this.list = resp.data.rows;
          console.log(resp);
        });
    },
  },
};
</script>

<style scoped></style>
