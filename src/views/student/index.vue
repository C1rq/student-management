<template>
  <div>
    <el-form
      :inline="true"
      :model="search"
      ref="searchForm"
      style="margin-top: 20px"
    >
      <el-form-item prop="stunum">
        <el-input v-model="search.stunum" placeholder="学号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="search.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="teacher">
        <el-input
          readonly
          v-model="search.teacher"
          placeholder="授课教师"
          @click.native="dialogTeacherVisible = true"
        ></el-input>
      </el-form-item>
      <el-form-item prop="class">
        <el-input v-model="search.class" placeholder="所在班级"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="$refs['searchForm'].resetFields()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!--学生列表 -->
    <el-table :data="list" height="400" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="stunum" label="学号" width="100">
      </el-table-column>
      <el-table-column prop="name" label="学生姓名" width="100">
      </el-table-column>
      <el-table-column prop="admissiondate" label="入学时间"> </el-table-column>
      <el-table-column prop="phone" label="手机号码"> </el-table-column>
      <el-table-column
        prop="teacher"
        label="授课教师"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="class"
        label="所在班级"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="job"
        label="工作单位"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="money"
        label="薪资待遇"
        width="100"
      ></el-table-column>
      <el-table-column label="操作">
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
    <!-- 分页模板 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 选择教师弹窗 -->
    <el-dialog
      title="选择教师"
      :visible.sync="dialogTeacherVisible"
      width="500px"
    >
      <teacher :isDialog="true" @option-teacher="optionTeacher"></teacher>
    </el-dialog>
    <!-- 新增学生弹窗 -->
    <el-dialog title="新增学生" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="student"
        ref="studentForm"
        lable-width="100px"
        lable-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="学号" prop="stunum">
          <el-input v-model="student.stunum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="student.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="student.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="入学时间" prop="admissiondate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="student.admissiondate"
            type="date"
            placeholder="入学时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-input
            v-model="student.teacher"
            readonly
            @click.native="editOptionTeacher"
          ></el-input>
        </el-form-item>
        <el-form-item label="所在班级" prop="class">
          <el-input v-model="student.class" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工作单位" prop="job">
          <el-input v-model="student.job" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="薪资待遇" prop="money">
          <el-input v-model="student.money" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            student._id === null
              ? addData('studentForm')
              : updateData('studentForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import studentApi from "@/api/student.js";
import Teacher from "@/views/teacher";
export default {
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      search: {
        stunum: "",
        name: "",
        teacher: "",
        class: "",
        teacherId: "",
      },
      student: {
        _id: null,
        stunum: "",
        name: "",
        teacher: "",
        class: "",
        admissiondate: "",
        phone: "",
        job: "",
        money: "",
      },
      rules: {
        stunum: [{ required: true, message: "学号不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "学生姓名不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" },
        ],
      },
      dialogFormVisible: false,
      dialogTeacherVisible: false,
      isEdit: false,
    };
  },

  components: {
    Teacher,
  },
  created() {
    this.fetchData();
  },
  methods: {
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          studentApi.update(this.student).then((response) => {
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          studentApi.add(this.student).then((response) => {
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
    editOptionTeacher() {
      this.isEdit = true;
      this.dialogTeacherVisible = true;
    },
    optionTeacher(currentRow) {
      if (this.isEdit) {
        this.student.teacher = currentRow.name;
        this.student.teacherId = currentRow.id;
      } else {
        this.search.teacher = currentRow.name;
        this.search.teacherId = currentRow.id;
        this.dialogFormVisible = false;
      }
      this.isEdit = false;
      this.dialogTeacherVisible = false;
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["studentForm"].resetFields();
      });
    },
    searchData() {
      this.currentPage = 1;
      this.fetchData();
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
    fetchData() {
      studentApi
        .search(this.currentPage, this.pageSize, this.search)
        .then((response) => {
          const resp = response.data;
          this.total = resp.data.total;
          this.list = resp.data.rows;
          console.log(resp);
        });
    },
    handleEdit(id) {
      this.handleAdd();
      studentApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.student = resp.data;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确定要删除此条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          studentApi.deleteById(id).then((response) => {
            const resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message,
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped></style>
