<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="内容标题" prop="articleTitle">
        <el-input
            v-model="queryParams.articleTitle"
            placeholder="请输入内容标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="发布者" prop="createBy">
        <el-input
            v-model="queryParams.createBy"
            placeholder="请输入发布人"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="显示方式" prop="status">
        <el-select v-model="queryParams.status" placeholder="显示方式" clearable style="width: 200px">
          <el-option
              v-for="dict in cms_article_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['cms:article:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['cms:article:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['cms:article:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="articleId" width="100" />
      <el-table-column
          label="内容标题"
          align="center"
          prop="articleTitle"
          :show-overflow-tooltip="true"
      />

      <el-table-column label="显示方式" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :options="cms_article_status" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column label="发布人" align="center" prop="createBy" width="100" />
      <el-table-column label="发布时间" align="center" prop="createTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="显示时间" align="center" prop="showTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.showTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cms:article:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cms:article:remove']" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="open" width="780px" append-to-body>
      <el-form ref="articleRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容标题" prop="articleTitle">
              <el-input v-model="form.articleTitle" placeholder="请输入内容标题" />
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="内容概要">
              <el-input v-model="form.articleDesc" type="textarea" placeholder="请输入内容概要"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="内容头图" prop="imgPath">
              <image-upload v-model="form.imgPath"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="显示方式">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in cms_article_status"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="显示时间" prop="showTime">
              <el-date-picker clearable
                              v-model="form.showTime"
                              type="datetime"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              placeholder="请选择显示时间">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="发布栏目" prop="catalogId">
              <el-tree
                  v-model="form.catalogId"
                  :data="catalogOptions"
                  show-checkbox
                  ref="catalogRef"
                  node-key="id"
                  empty-text="加载中，请稍候"
                  :props="{ label: 'catalogName', children: 'children' }"
              ></el-tree>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="内容HTML">
              <editor v-model="form.articleHtml" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="content">
import { listArticle, getArticle, delArticle, addArticle, updateArticle } from "@/api/cms/article";
import { treeCatalog } from "@/api/cms/catalog";

const { proxy } = getCurrentInstance();
const { cms_article_status} = proxy.useDict("cms_article_status");

const articleList = ref([]);
const catalogOptions = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    articleTitle: undefined,
    createBy: undefined,
    status: undefined
  },
  rules: {
    articleTitle: [{ required: true, message: "内容标题不能为空", trigger: "blur" }],
    articleHtml: [{ required: true, message: "内容正文不能为空", trigger: "blur" }]
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询内容列表 */
function getList() {
  loading.value = true;
  listArticle(queryParams.value).then(response => {
    articleList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/**
 * 树形栏目
 */
function getCatalogTreeSelect() {
  treeCatalog().then(response => {
    catalogOptions.value = response.data;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    articleId: undefined,
    articleTitle: undefined,
    articleType: undefined,
    articleArticle: undefined,
    status: "0"
  };
  proxy.resetForm("articleRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.articleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  getCatalogTreeSelect();
  open.value = true;
  title.value = "添加内容";
}
/**修改按钮操作 */
function handleUpdate(row) {
  reset();
  const articleId = row.articleId || ids.value;
  getArticle(articleId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改内容";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["articleRef"].validate(valid => {
    if (valid) {
      if (form.value.articleId != undefined) {
        updateArticle(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addArticle(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const articleIds = row.articleId || ids.value
  proxy.$modal.confirm('是否确认删除内容编号为"' + articleIds + '"的数据项？').then(function() {
    return delarticle(articleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
